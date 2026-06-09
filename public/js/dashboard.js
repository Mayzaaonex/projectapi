const MAX_HISTORY = 24;
const API_STATS_URL = '/api/stats';
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

async function fetchStats() {
    try {
        const res = await fetch(API_STATS_URL);
        if (!res.ok) return;
        
        const data = await res.json();
        const now = new Date();
        const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

        const newRequests = Math.max(0, (data.total || 0) - prevTotal);
        prevTotal = data.total || 0;

        if (trafficChart) {
            trafficData.push(newRequests);
            trafficData.shift();
            trafficLabels.push(timeStr);
            trafficLabels.shift();
            trafficChart.data.datasets[0].data = [...trafficData];
            trafficChart.data.labels = [...trafficLabels];
            trafficChart.update('active');
        }

        document.getElementById('total-requests').textContent = (data.total || 0).toLocaleString();
        document.getElementById('credits-used').textContent = (data.credits || 0).toLocaleString();
        document.getElementById('credit-bar').style.width = Math.min(100, (data.credits || 0) / 100) + '%';
    } catch (e) {
        console.log('Menunggu data...');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Sidebar.render('dashboard');
    initChart();
    fetchStats();
    setInterval(fetchStats, 2000);
});