const MAX_HISTORY = 24;
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let prevTotal = 0;

// ========== PARTICLE SYSTEM ==========
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    drawParticle(p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        this.ctx.fill();
    }

    drawConnections() {
        const maxDist = 120;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.08;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse connection
            if (this.mouse.x !== null) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    update() {
        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        for (let p of this.particles) {
            this.drawParticle(p);
        }
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

// ========== WELCOME SCREEN ==========
function initWelcomeScreen() {
    const welcome = document.getElementById('welcome-screen');
    if (!welcome) return;

    // Check if already shown in this session
    if (sessionStorage.getItem('welcomeShown')) {
        welcome.style.display = 'none';
        return;
    }

    setTimeout(() => {
        welcome.classList.add('fade-out');
        setTimeout(() => {
            welcome.style.display = 'none';
            sessionStorage.setItem('welcomeShown', 'true');
        }, 1200);
    }, 2500);
}

// ========== CHART ==========
function initChart() {
    const ctx = document.getElementById('trafficChart')?.getContext('2d');
    if (!ctx) return;

    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trafficLabels,
            datasets: [{
                data: trafficData,
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                fill: true,
                tension: 0.4,
                borderWidth: 1.5,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,255,255,0.5)',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            plugins: { legend: { display: false } },
            scales: {
                x: { 
                    grid: { color: 'rgba(255,255,255,0.03)' }, 
                    ticks: { color: '#555', font: { size: 9 }, maxTicksLimit: 6 } 
                },
                y: { 
                    grid: { color: 'rgba(255,255,255,0.03)' }, 
                    ticks: { color: '#555', font: { size: 9 }, maxTicksLimit: 4 }, 
                    min: 0, 
                    max: 30 
                }
            }
        }
    });
}

function updateStats() {
    if (!trafficChart) return;

    const stats = JSON.parse(localStorage.getItem('api_stats') || '{"total":0,"credits":0,"history":[]}');
    const now = new Date();
    const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

    const newRequests = Math.max(0, stats.total - prevTotal);
    prevTotal = stats.total;

    trafficData.push(newRequests);
    trafficData.shift();
    trafficLabels.push(timeStr);
    trafficLabels.shift();

    trafficChart.data.datasets[0].data = [...trafficData];
    trafficChart.data.labels = [...trafficLabels];
    trafficChart.update('active');

    document.getElementById('total-requests').textContent = stats.total.toLocaleString();
    document.getElementById('credits-used').textContent = stats.credits.toLocaleString();
    document.getElementById('credit-bar').style.width = Math.min(100, stats.credits / 100) + '%';
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Sidebar !== 'undefined') Sidebar.render('dashboard');

    if (!localStorage.getItem('api_stats')) {
        localStorage.setItem('api_stats', JSON.stringify({ total: 0, credits: 0, history: [] }));
    }

    // Initialize particle system
    new ParticleSystem();

    // Initialize welcome screen
    initWelcomeScreen();

    initChart();
    setInterval(updateStats, 2000);
    updateStats();
});