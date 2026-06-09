// ==================== CONFIG ====================
const MAX_HISTORY = 24;
const REFRESH_INTERVAL = 1500;

// ==================== TRAFFIC CHART ====================
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let mockCounter = 0;

function initChart() {
    const ctx = document.getElementById('trafficChart')?.getContext('2d');
    if (!ctx) return;

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
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 300 },
            plugins: { legend: { display: false } },
            scales: {
                x: { 
                    grid: { color: '#1e293b' }, 
                    ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 6 } 
                },
                y: { 
                    grid: { color: '#1e293b' }, 
                    ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 4, callback: v => v + ' req' },
                    min: 0, max: 50 
                }
            }
        }
    });
}

function updateChart() {
    if (!trafficChart) return;
    
    const now = new Date();
    const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    
    const newRequests = Math.floor(Math.random() * 8);
    mockCounter += newRequests;
    
    trafficData.push(newRequests);
    trafficData.shift();
    trafficLabels.push(timeStr);
    trafficLabels.shift();
    
    trafficChart.data.datasets[0].data = [...trafficData];
    trafficChart.data.labels = [...trafficLabels];
    trafficChart.update('active');
    
    // Update stats
    document.getElementById('total-requests').textContent = mockCounter.toLocaleString();
    document.getElementById('credits-used').textContent = Math.floor(mockCounter * 0.8).toLocaleString();
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    Sidebar.render('dashboard');
    initChart();
    setInterval(updateChart, REFRESH_INTERVAL);
    updateChart();
});