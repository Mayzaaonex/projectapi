// ==================== THEME TOGGLE ====================
function toggleTheme() {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Update chart theme
    if (trafficChart) {
        const gridColor = isLight ? '#e2e8f0' : '#1e293b';
        const textColor = isLight ? '#94a3b8' : '#64748b';
        trafficChart.options.scales.x.grid.color = gridColor;
        trafficChart.options.scales.x.ticks.color = textColor;
        trafficChart.options.scales.y.grid.color = gridColor;
        trafficChart.options.scales.y.ticks.color = textColor;
        trafficChart.update();
    }
}

// Load saved theme
(function() {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light');
    }
})();

// ==================== TRAFFIC CHART (REAL-TIME) ====================
let trafficChart;
const maxDataPoints = 24;
const trafficData = [];
const trafficLabels = [];

// Initialize with empty data
for (let i = 0; i < maxDataPoints; i++) {
    trafficData.push(0);
    trafficLabels.push('');
}

function initChart() {
    const ctx = document.getElementById('trafficChart')?.getContext('2d');
    if (!ctx) return;
    
    const isLight = document.documentElement.classList.contains('light');
    
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trafficLabels,
            datasets: [{
                data: trafficData,
                borderColor: '#818cf8',
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
                    gradient.addColorStop(0, 'rgba(129, 140, 248, 0.15)');
                    gradient.addColorStop(1, 'rgba(129, 140, 248, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#818cf8',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 300,
                easing: 'easeOutQuart'
            },
            interaction: { 
                intersect: false, 
                mode: 'index' 
            },
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: isLight ? '#fff' : '#111827',
                    titleColor: isLight ? '#0f172a' : '#e2e8f0',
                    bodyColor: isLight ? '#64748b' : '#94a3b8',
                    borderColor: isLight ? '#e2e8f0' : '#1e293b',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} requests/detik`
                    }
                }
            },
            scales: {
                x: { 
                    grid: { color: isLight ? '#e2e8f0' : '#1e293b' }, 
                    ticks: { 
                        color: isLight ? '#94a3b8' : '#64748b', 
                        font: { size: 9 }, 
                        maxTicksLimit: 6,
                        callback: function(val, index) {
                            return trafficLabels[index] || '';
                        }
                    } 
                },
                y: { 
                    grid: { color: isLight ? '#e2e8f0' : '#1e293b' }, 
                    ticks: { 
                        color: isLight ? '#94a3b8' : '#64748b', 
                        font: { size: 9 }, 
                        maxTicksLimit: 4, 
                        callback: v => v + ' req' 
                    },
                    min: 0,
                    max: 150,
                    beginAtZero: true
                }
            }
        }
    });
    
    // Start real-time updates
    startRealTimeSimulation();
}

// Simulasi real-time dengan pola natural
function startRealTimeSimulation() {
    let baseValue = 45;
    let trend = 1;
    
    setInterval(() => {
        if (!trafficChart) return;
        
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const timeStr = `${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        
        // Natural pattern: higher during business hours
        const hourFactor = Math.sin((hour - 6) * Math.PI / 12) * 25;
        
        // Random spike sometimes
        const spike = Math.random() < 0.08 ? Math.random() * 60 : 0;
        
        // Random noise
        const noise = (Math.random() - 0.5) * 20;
        
        // Trend shift slowly
        trend += (Math.random() - 0.5) * 2;
        trend = Math.max(-15, Math.min(15, trend));
        
        // Calculate value
        let value = baseValue + hourFactor + noise + spike + trend;
        value = Math.max(8, Math.min(140, value));
        value = Math.round(value);
        
        // Update arrays
        trafficData.push(value);
        trafficData.shift();
        trafficLabels.push(timeStr);
        trafficLabels.shift();
        
        // Update chart
        trafficChart.data.datasets[0].data = [...trafficData];
        trafficChart.data.labels = [...trafficLabels];
        trafficChart.update('active');
        
        // Slowly drift base value
        baseValue += (Math.random() - 0.5) * 1.5;
        baseValue = Math.max(30, Math.min(70, baseValue));
        
    }, 1500); // Update every 1.5 seconds for real-time feel
}

// ==================== PAGE SWITCH ====================
function switchPage(page, el) {
    event.preventDefault();
    
    const currentPage = document.querySelector('.page[style*="display: block"]') || 
                        document.querySelector('.page:not([style*="display: none"])');
    const target = document.getElementById('page-' + page);
    
    if (!target || currentPage === target) return;
    
    // Fade out current
    if (currentPage) {
        currentPage.style.animation = 'pageOut 0.2s ease forwards';
        setTimeout(() => {
            currentPage.style.display = 'none';
            currentPage.style.animation = '';
        }, 200);
    }
    
    // Fade in target
    setTimeout(() => {
        target.style.display = 'block';
        target.style.animation = 'pageIn 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        
        // Init chart if dashboard
        if (page === 'dashboard' && !trafficChart) {
            setTimeout(initChart, 300);
        }
    }, 150);
    
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (el) el.classList.add('active');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Hide non-dashboard pages
    document.querySelectorAll('.page').forEach(p => {
        if (p.id !== 'page-dashboard') p.style.display = 'none';
    });
    
    // Init chart after DOM ready
    setTimeout(initChart, 500);
});

// ==================== MODAL LOGIC ====================
const subApiData = {
    maker: {
        title: 'Maker Endpoints',
        items: [
            { name: 'Brat Generator', icon: '🟢', desc: 'Buat teks gaya Brat', endpoint: '/api/maker/brat' },
            { name: 'Text Pro', icon: '📝', desc: 'Text styling premium', endpoint: '/api/maker/textpro' },
            { name: 'Image Gen', icon: '🖼️', desc: 'Generate gambar AI', endpoint: '/api/maker/image' },
            { name: 'Sticker', icon: '🌟', desc: 'Buat stiker WA', endpoint: '/api/maker/sticker' }
        ]
    },
    downloader: {
        title: 'Downloader Endpoints',
        items: [
            { name: 'TikTok', icon: '🎵', desc: 'Download video TikTok', endpoint: '/api/downloader/tiktok' },
            { name: 'YouTube', icon: '▶️', desc: 'Download video YT', endpoint: '/api/downloader/yt' },
            { name: 'Instagram', icon: '📷', desc: 'Download post/reel IG', endpoint: '/api/downloader/ig' }
        ]
    },
    tools: {
        title: 'Tools Endpoints',
        items: [
            { name: 'Stalker IG', icon: '👁️', desc: 'Stalk profil Instagram', endpoint: '/api/tools/stalkig' },
            { name: 'Nulis', icon: '✍️', desc: 'Teks ke gambar nulis', endpoint: '/api/tools/nulis' },
            { name: 'OCR', icon: '🔍', desc: 'Ekstrak teks gambar', endpoint: '/api/tools/ocr' }
        ]
    }
};

function openSubApi(key) {
    const data = subApiData[key];
    if (!data) return;
    
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-content').innerHTML = data.items.map(item => `
        <div class="modal-item">
            <div class="flex items-center gap-3">
                <span class="text-xl">${item.icon}</span>
                <div class="flex-1">
                    <p class="text-main text-sm font-semibold">${item.name}</p>
                    <p class="text-[11px] text-sub">${item.desc}</p>
                </div>
                <code class="text-[10px] bg-slate-800 light:bg-slate-100 px-2 py-1 rounded text-sub mono">${item.endpoint}</code>
            </div>
        </div>
    `).join('');
    
    document.getElementById('modal-overlay').classList.add('show');
}

function closeModal(e) {
    if (e.target === document.getElementById('modal-overlay')) {
        document.getElementById('modal-overlay').classList.remove('show');
    }
}

function closeModalDirect() {
    document.getElementById('modal-overlay').classList.remove('show');
}

// ESC key to close modal
document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') closeModalDirect(); 
});

// ==================== STATS UPDATE ====================
setInterval(() => {
    const upEl = document.getElementById('stat-uptime');
    const krEl = document.getElementById('stat-kredit');
    const barEl = document.getElementById('credit-bar');
    
    if (upEl) {
        const uptime = (99.90 + Math.random() * 0.1).toFixed(2);
        upEl.innerText = uptime + '%';
    }
    
    if (krEl && barEl) {
        const k = Math.floor(6500 + Math.random() * 500);
        krEl.innerText = k.toLocaleString();
        const percent = Math.min(100, (k / 100));
        barEl.style.width = percent + '%';
    }
}, 3000);