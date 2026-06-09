const MAX_HISTORY = 24;
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let prevTotal = 0;

// ========== LIGHTWEIGHT CURSOR-FOLLOWING PARTICLE SYSTEM ==========
class CursorParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.isActive = true;
        this.frameCount = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Touch support
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });

        // Create fewer particles for performance
        this.createParticles(25);
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }

    update() {
        for (let p of this.particles) {
            // Calculate distance to mouse
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Follow cursor with easing
            p.vx += dx * p.speed * 0.05;
            p.vy += dy * p.speed * 0.05;

            // Apply friction
            p.vx *= 0.95;
            p.vy *= 0.95;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections (only every 3rd frame for performance)
        if (this.frameCount % 3 === 0) {
            const maxDist = 100;
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const opacity = (1 - dist / maxDist) * 0.06;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            }
        }

        // Draw particles
        for (let p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
        }

        // Draw mouse glow
        const gradient = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 0,
            this.mouse.x, this.mouse.y, 80
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.03)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 80, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        if (!this.isActive) return;
        this.frameCount++;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ========== WELCOME SCREEN ==========
function initWelcomeScreen() {
    const welcome = document.getElementById('welcome-screen');
    if (!welcome) {
        console.log('Welcome screen element not found');
        return;
    }

    // Check if already shown in this session
    if (sessionStorage.getItem('welcomeShown')) {
        welcome.style.display = 'none';
        console.log('Welcome already shown, hiding');
        return;
    }

    console.log('Showing welcome screen...');

    // Force display block first
    welcome.style.display = 'flex';

    setTimeout(() => {
        welcome.classList.add('fade-out');
        setTimeout(() => {
            welcome.style.display = 'none';
            sessionStorage.setItem('welcomeShown', 'true');
            console.log('Welcome screen hidden');
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

    const totalEl = document.getElementById('total-requests');
    const creditsEl = document.getElementById('credits-used');
    const creditBar = document.getElementById('credit-bar');

    if (totalEl) totalEl.textContent = stats.total.toLocaleString();
    if (creditsEl) creditsEl.textContent = stats.credits.toLocaleString();
    if (creditBar) creditBar.style.width = Math.min(100, stats.credits / 100) + '%';
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');

    if (typeof Sidebar !== 'undefined') Sidebar.render('dashboard');

    if (!localStorage.getItem('api_stats')) {
        localStorage.setItem('api_stats', JSON.stringify({ total: 0, credits: 0, history: [] }));
    }

    // Initialize particle system
    new CursorParticleSystem();

    // Initialize welcome screen - IMPORTANT: must be after particles
    initWelcomeScreen();

    initChart();
    setInterval(updateStats, 2000);
    updateStats();

    console.log('Initialization complete');
});