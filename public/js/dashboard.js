// ==================== CONFIG ====================
const MAX_HISTORY = 24;
const REFRESH_INTERVAL = 1500;

// ==================== TRAFFIC CHART ====================
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let totalRequests = 124521;
let totalCredits = 8456;
let baseValue = 15;
let trend = 0;
let hourSimulation = new Date().getHours();

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
                    gradient.addColorStop(0, 'rgba(129, 140, 248, 0.2)');
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
            animation: { duration: 400, easing: 'easeOutQuart' },
            interaction: { intersect: false, mode: 'index' },
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    titleColor: '#e2e8f0',
                    bodyColor: '#94a3b8',
                    borderColor: '#1e293b',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: false,
                }
            },
            scales: {
                x: { 
                    grid: { color: '#1e293b' }, 
                    ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 6 } 
                },
                y: { 
                    grid: { color: '#1e293b' }, 
                    ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 4, callback: v => v + ' req' },
                    min: 0, 
                    max: 60 
                }
            }
        }
    });
}

function updateChart() {
    if (!trafficChart) return;
    
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const timeStr = hour + ':' + String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0');
    
    // Natural traffic pattern
    const hourFactor = Math.sin((hour - 6) * Math.PI / 12) * 15; // Peak at 12:00
    const minuteNoise = Math.sin(minute * Math.PI / 30) * 5;
    const randomSpike = Math.random() < 0.05 ? Math.floor(Math.random() * 20) + 5 : 0;
    const noise = (Math.random() - 0.5) * 4;
    
    // Trend shift slowly
    trend += (Math.random() - 0.5) * 1.5;
    trend = Math.max(-8, Math.min(8, trend));
    
    let newRequests = Math.round(baseValue + hourFactor + minuteNoise + noise + trend + randomSpike);
    newRequests = Math.max(2, Math.min(55, newRequests));
    
    // Update data
    trafficData.push(newRequests);
    trafficData.shift();
    trafficLabels.push(timeStr);
    trafficLabels.shift();
    
    trafficChart.data.datasets[0].data = [...trafficData];
    trafficChart.data.labels = [...trafficLabels];
    trafficChart.update('active');
    
    // Update stats dengan natural increment
    totalRequests += newRequests;
    totalCredits += Math.floor(newRequests * 0.7);
    
    document.getElementById('total-requests').textContent = totalRequests.toLocaleString();
    document.getElementById('credits-used').textContent = totalCredits.toLocaleString();
    
    const creditPercent = Math.min(100, totalCredits / 100);
    document.getElementById('credit-bar').style.width = creditPercent + '%';
    
    // Slow drift base value
    baseValue += (Math.random() - 0.5) * 0.8;
    baseValue = Math.max(10, Math.min(30, baseValue));
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    Sidebar.render('dashboard');
    
    // Isi initial data dulu biar grafik langsung ada
    for (let i = 0; i < MAX_HISTORY; i++) {
        const pastHour = (new Date().getHours() - (MAX_HISTORY - i) + 24) % 24;
        const hourFactor = Math.sin((pastHour - 6) * Math.PI / 12) * 15;
        trafficData[i] = Math.round(15 + hourFactor + (Math.random() - 0.5) * 8);
        trafficData[i] = Math.max(2, Math.min(50, trafficData[i]));
    }
    
    initChart();
    setInterval(updateChart, REFRESH_INTERVAL);
    updateChart();
});