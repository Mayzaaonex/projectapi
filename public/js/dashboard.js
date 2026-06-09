const MAX_HISTORY = 24;
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let prevTotal = 0;

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
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#818cf8',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 6 } },
                y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 4 }, min: 0, max: 30 }
            }
        }
    });
}

function updateStats() {
    if (!trafficChart) return;

    const stats = JSON.parse(localStorage.getItem('api_stats') || '{"total":0,"credits":0,"history":[]}');
    const now = new Date();
    const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

    // Hit new requests since last check
    const newRequests = Math.max(0, stats.total - prevTotal);
    prevTotal = stats.total;

    trafficData.push(newRequests);
    trafficData.shift();
    trafficLabels.push(timeStr);
    trafficLabels.shift();

    trafficChart.data.datasets[0].data = [...trafficData];
    trafficChart.data.labels = [...trafficLabels];
    trafficChart.update('active');

    // Update cards
    document.getElementById('total-requests').textContent = stats.total.toLocaleString();
    document.getElementById('credits-used').textContent = stats.credits.toLocaleString();
    document.getElementById('credit-bar').style.width = Math.min(100, stats.credits / 100) + '%';
}

document.addEventListener('DOMContentLoaded', () => {
    Sidebar.render('dashboard');
    
    // Init stats localStorage kalo kosong
    if (!localStorage.getItem('api_stats')) {
        localStorage.setItem('api_stats', JSON.stringify({ total: 0, credits: 0, history: [] }));
    }
    
    initChart();
    setInterval(updateStats, 2000);
    updateStats();
});