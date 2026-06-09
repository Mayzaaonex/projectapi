<?php
// Vercel: pake /tmp/ buat writable storage
$statsFile = '/tmp/stats.json';
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
    <link rel="stylesheet" href="/public/style.css">
</head>
<body>
    <div class="flex h-screen overflow-hidden">
        
        <?php include 'inc/sidebar.php'; ?>

        <main class="flex-1 overflow-y-auto p-8">
            <div class="max-w-5xl mx-auto">
                
                <div class="text-center mb-10">
                    <h1 class="text-3xl font-extrabold text-white">
                        Dashboard <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Overview</span>
                    </h1>
                    <p class="text-sm text-slate-400 mt-2">Status real-time & performa API.</p>
                </div>

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
                            <?php echo number_format($stats['total_requests'] ?? 0); ?>
                        </span>
                    </div>
                    <div class="stat-card">
                        <p class="stat-label">Kredit Terpakai</p>
                        <span id="credits-used" class="stat-value mono">
                            <?php echo number_format($stats['credits_used'] ?? 0); ?>
                        </span>
                        <div class="credit-bar-bg mt-4">
                            <div id="credit-bar" class="credit-bar-fill" style="width: <?php echo min(100, ($stats['credits_used'] ?? 0) / 100); ?>%;"></div>
                        </div>
                    </div>
                </div>

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

    <script src="/public/dashboard.js"></script>
</body>
</html>