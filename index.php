<?php
// Baca stats
$statsFile = __DIR__ . '/data/stats.json';
if (!file_exists($statsFile)) {
    file_put_contents($statsFile, json_encode([
        'total_requests' => 0,
        'credits_used' => 0,
        'history' => []
    ]));
}
$stats = json_decode(file_get_contents($statsFile), true);
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Api-Mayzaa - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="public/style.css">
</head>
<body>
    <div class="flex h-screen overflow-hidden">
        
        <!-- SIDEBAR -->
        <?php include 'inc/sidebar.php'; ?>

        <!-- MAIN -->
        <main class="flex-1 overflow-y-auto p-8">
            <div class="max-w-5xl mx-auto">
                
                <!-- Header -->
                <div class="text-center mb-10">
                    <h1 class="text-3xl font-extrabold text-white">
                        Dashboard <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Overview</span>
                    </h1>
                    <p class="text-sm text-slate-400 mt-2">Status real-time & performa API.</p>
                </div>

                <!-- 3 Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="stat-card">
                        <p class="stat-label">Status Sistem</p>
                        <div class="flex items-center justify-center gap-2">
                            <div class="status-dot"></div>
                            <span class="text-white font-semibold">Operational</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <p class="stat-label">Total Requests</p>
                        <span id="total-requests" class="stat-value mono">
                            <?php echo number_format($stats['total_requests']); ?>
                        </span>
                    </div>
                    
                    <div class="stat-card">
                        <p class="stat-label">Kredit Terpakai</p>
                        <span id="credits-used" class="stat-value mono">
                            <?php echo number_format($stats['credits_used']); ?>
                        </span>
                        <div class="credit-bar-bg mt-4">
                            <div id="credit-bar" class="credit-bar-fill" style="width: <?php echo min(100, $stats['credits_used'] / 100); ?>%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Chart -->
                <div class="chart-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-white font-semibold text-sm">Traffic Real-Time</h3>
                        <span class="text-xs text-slate-500 mono bg-slate-800 px-3 py-1 rounded-full">LIVE</span>
                    </div>
                    <div class="chart-wrapper">
                        <canvas id="trafficChart"></canvas>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <script>
        const MAX_HISTORY = 24;
        let trafficData = Array(MAX_HISTORY).fill(0);
        let trafficLabels = Array(MAX_HISTORY).fill('--:--');
        let trafficChart;

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

        // Fetch real stats
        async function fetchStats() {
            try {
                const res = await fetch('/api-dashboard/api/stats.php');
                const data = await res.json();

                document.getElementById('total-requests').textContent = data.total_requests.toLocaleString();
                document.getElementById('credits-used').textContent = data.credits_used.toLocaleString();
                
                const bar = document.getElementById('credit-bar');
                bar.style.width = Math.min(100, data.credits_used / 100) + '%';

                // Update chart
                const now = new Date();
                const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
                
                const currentRequests = data.total_requests;
                const newRequests = trafficData[MAX_HISTORY - 1] > 0 ? 
                    Math.max(0, currentRequests - prevTotal) : 
                    (data.history.slice(-1)[0]?.count || 0);

                trafficData.push(newRequests);
                trafficData.shift();
                trafficLabels.push(timeStr);
                trafficLabels.shift();

                if (trafficChart) {
                    trafficChart.data.datasets[0].data = [...trafficData];
                    trafficChart.data.labels = [...trafficLabels];
                    trafficChart.update('active');
                }

                prevTotal = currentRequests;
            } catch (e) {
                console.log('Waiting for data...');
            }
        }

        let prevTotal = <?php echo $stats['total_requests']; ?>;

        window.addEventListener('DOMContentLoaded', () => {
            initChart();
            setInterval(fetchStats, 1000);
            fetchStats();
        });
    </script>
</body>
</html>