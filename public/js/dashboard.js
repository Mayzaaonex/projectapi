const MAX_HISTORY = 24;
let trafficChart;
let trafficData = Array(MAX_HISTORY).fill(0);
let trafficLabels = Array(MAX_HISTORY).fill('--:--');
let totalRequests = 124521;
let totalCredits = 8456;
let baseTraffic = 18;

// Inisialisasi data awal
for (let i = 0; i < MAX_HISTORY; i++) {
    trafficData[i] = Math.floor(Math.random() * 20) + 10;
}

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
                x: { 
                    grid: { color: '#1e293b' }, 
                    ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 6 } 
                },
                y: { 
                    grid: { color: '#1e293b' }, 
                    ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 4 },
                    min: 0, 
                    max: 50 
                }
            }
        }
    });
}

function updateChart() {
    if (!trafficChart) return;
    
    const now = new Date();
    const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    
    // Traffic natural: naik turun halus
    baseTraffic += (Math.random() - 0.5) * 2;
    baseTraffic = Math.max(10, Math.min(30, baseTraffic));
    const newRequests = Math.floor(baseTraffic + (Math.random() - 0.5) * 10);
    
    trafficData.push(Math.max(3, newRequests));
    trafficData.shift();
    trafficLabels.push(timeStr);
    trafficLabels.shift();
    
    trafficChart.data.datasets[0].data = [...trafficData];
    trafficChart.data.labels = [...trafficLabels];
    trafficChart.update('active');
    
    // Update stats
    totalRequests += newRequests;
    totalCredits += Math.floor(newRequests * 0.8);
    
    document.getElementById('total-requests').textContent = totalRequests.toLocaleString();
    document.getElementById('credits-used').textContent = totalCredits.toLocaleString();
    document.getElementById('credit-bar').style.width = Math.min(100, totalCredits / 100) + '%';
}

document.addEventListener('DOMContentLoaded', () => {
    Sidebar.render('dashboard');
    initChart();
    setInterval(updateChart, 1500);
    updateChart();
});