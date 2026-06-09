// ==================== CONFIG ====================
const API_STATS_URL = '/api/stats';
const REFRESH_INTERVAL = 1000;
const MAX_HISTORY = 24;

// ==================== THEME TOGGLE ====================
function toggleTheme() {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
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

(function() {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light');
    }
})();

// ==================== TRAFFIC CHART ====================
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let prevTotal = 0;

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
                }
            },
            scales: {
                x: { 
                    grid: { color: isLight ? '#e2e8f0' : '#1e293b' }, 
                    ticks: { 
                        color: isLight ? '#94a3b8' : '#64748b', 
                        font: { size: 9 }, 
                        maxTicksLimit: 6 
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
                    max: 50,
                    beginAtZero: true
                }
            }
        }
    });
}

// ==================== FETCH REAL STATS ====================
async function fetchStats() {
    try {
        const res = await fetch(API_STATS_URL);
        if (!res.ok) throw new Error('API not ready');
        
        const data = await res.json();
        
        // Update cards
        const totalEl = document.getElementById('total-requests');
        const creditsEl = document.getElementById('credits-used');
        const barEl = document.getElementById('credit-bar');
        
        if (totalEl) totalEl.textContent = Number(data.total_requests || 0).toLocaleString();
        if (creditsEl) creditsEl.textContent = Number(data.credits_used || 0).toLocaleString();
        if (barEl) barEl.style.width = Math.min(100, (data.credits_used || 0) / 100) + '%';
        
        // Update chart
        const now = new Date();
        const timeStr = now.getHours() + ':' + 
                        String(now.getMinutes()).padStart(2, '0') + ':' + 
                        String(now.getSeconds()).padStart(2, '0');
        
        const currentTotal = data.total_requests || 0;
        const newRequests = prevTotal > 0 ? 
            Math.max(0, currentTotal - prevTotal) : 
            ((data.history && data.history.slice(-1)[0]) ? data.history.slice(-1)[0].count : 0);
        
        trafficData.push(newRequests);
        trafficData.shift();
        trafficLabels.push(timeStr);
        trafficLabels.shift();
        
        if (trafficChart) {
            trafficChart.data.datasets[0].data = [...trafficData];
            trafficChart.data.labels = [...trafficLabels];
            trafficChart.update('active');
        }
        
        prevTotal = currentTotal;
        
    } catch (e) {
        console.log('Waiting for API data...');
    }
}

// ==================== PAGE SWITCH ====================
function switchPage(page, el) {
    event.preventDefault();
    
    const currentPage = document.querySelector('.page[style*="display: block"]') || 
                        document.querySelector('.page:not([style*="display: none"])');
    const target = document.getElementById('page-' + page);
    
    if (!target || currentPage === target) return;
    
    if (currentPage) {
        currentPage.style.animation = 'pageOut 0.2s ease forwards';
        setTimeout(() => {
            currentPage.style.display = 'none';
            currentPage.style.animation = '';
        }, 200);
    }
    
    setTimeout(() => {
        target.style.display = 'block';
        target.style.animation = 'pageIn 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        
        if (page === 'dashboard' && !trafficChart) {
            setTimeout(initChart, 300);
        }
    }, 150);
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (el) el.classList.add('active');
}

// ==================== MODAL LOGIC ====================
const subApiData = {
    maker: {
        title: 'Maker Endpoints',
        items: [
            { name: 'Brat Generator', icon: '🟢', desc: 'Buat teks gaya Brat', endpoint: '/maker/brat.php' },
            { name: 'Text Pro', icon: '📝', desc: 'Text styling premium', endpoint: '/maker/textpro.php' },
            { name: 'Image Gen', icon: '🖼️', desc: 'Generate gambar AI', endpoint: '/maker/image.php' },
            { name: 'Sticker Maker', icon: '🌟', desc: 'Buat stiker WA', endpoint: '/maker/sticker.php' }
        ]
    },
    downloader: {
        title: 'Downloader Endpoints',
        items: [
            { name: 'TikTok', icon: '🎵', desc: 'Download video TikTok', endpoint: '/downloader/tiktok.php' },
            { name: 'YouTube', icon: '▶️', desc: 'Download video YouTube', endpoint: '/downloader/yt.php' },
            { name: 'Instagram', icon: '📷', desc: 'Download post/reel IG', endpoint: '/downloader/ig.php' }
        ]
    },
    tools: {
        title: 'Tools Endpoints',
        items: [
            { name: 'Stalker IG', icon: '👁️', desc: 'Stalk profil Instagram', endpoint: '/tools/stalkig.php' },
            { name: 'Nulis', icon: '✍️', desc: 'Teks ke gambar nulis', endpoint: '/tools/nulis.php' },
            { name: 'OCR', icon: '🔍', desc: 'Ekstrak teks gambar', endpoint: '/tools/ocr.php' }
        ]
    }
};

function openSubApi(key) {
    const data = subApiData[key];
    if (!data) return;
    
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-content').innerHTML = data.items.map(item => `
        <div class="modal-item" onclick="window.location.href='${item.endpoint}'">
            <div class="flex items-center gap-3">
                <span class="text-xl">${item.icon}</span>
                <div class="flex-1">
                    <p class="text-white text-sm font-semibold">${item.name}</p>
                    <p class="text-[11px] text-slate-500">${item.desc}</p>
                </div>
                <code class="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 mono">${item.endpoint}</code>
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

// ESC to close
document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') closeModalDirect(); 
});

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.createElement('div');
        toast.textContent = '✅ Link API dicopy!';
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #22c55e; color: #000; padding: 12px 20px;
            border-radius: 12px; font-weight: 600; font-size: 13px;
            z-index: 9999; animation: fadeInUp 0.3s ease;
            box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Hide non-dashboard pages
    document.querySelectorAll('.page').forEach(p => {
        if (p.id !== 'page-dashboard') p.style.display = 'none';
    });
    
    // Init chart
    setTimeout(initChart, 400);
    
    // Start real-time polling
    setInterval(fetchStats, REFRESH_INTERVAL);
    fetchStats();
});