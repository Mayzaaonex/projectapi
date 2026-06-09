<?php
$downloadList = [
    ['name' => 'TikTok', 'icon' => '🎵', 'desc' => 'Download video TikTok tanpa watermark.', 'endpoint' => '/downloader/tiktok', 'link' => '/downloader/tiktok'],
    ['name' => 'YouTube', 'icon' => '▶️', 'desc' => 'Download video YouTube berbagai resolusi.', 'endpoint' => '/downloader/yt', 'link' => '/downloader/yt'],
    ['name' => 'Instagram', 'icon' => '📷', 'desc' => 'Download post, reel & story Instagram.', 'endpoint' => '/downloader/ig', 'link' => '/downloader/ig'],
    ['name' => 'Facebook', 'icon' => '📘', 'desc' => 'Download video Facebook HD.', 'endpoint' => '/downloader/fb', 'link' => '/downloader/fb'],
    ['name' => 'Twitter/X', 'icon' => '🐦', 'desc' => 'Download video & GIF dari Twitter.', 'endpoint' => '/downloader/twitter', 'link' => '/downloader/twitter'],
    ['name' => 'SnackVideo', 'icon' => '🍿', 'desc' => 'Download video SnackVideo tanpa watermark.', 'endpoint' => '/downloader/snack', 'link' => '/downloader/snack']
];
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Downloader API - Api-Mayzaa</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/public/style.css">
</head>
<body>
    <div class="flex h-screen overflow-hidden">
        
        <?php include '../inc/sidebar.php'; ?>

        <main class="flex-1 overflow-y-auto p-8">
            <div class="max-w-4xl mx-auto">
                
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-white">⬇️ Downloader API</h1>
                    <p class="text-sm text-slate-400 mt-1">Pilih platform untuk mendownload konten.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <?php foreach ($downloadList as $api): ?>
                    <a href="<?php echo $api['link']; ?>" class="api-menu-card text-center">
                        <span class="text-4xl mb-4 block"><?php echo $api['icon']; ?></span>
                        <h3 class="text-white font-semibold text-sm mb-2"><?php echo $api['name']; ?></h3>
                        <p class="text-xs text-slate-500 mb-3"><?php echo $api['desc']; ?></p>
                        <code class="text-[10px] bg-slate-950 text-slate-500 px-3 py-1 rounded-full mono"><?php echo $api['endpoint']; ?></code>
                    </a>
                    <?php endforeach; ?>
                </div>

                <div class="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 class="text-white font-semibold text-sm mb-2">📌 Cara Penggunaan</h3>
                    <div class="text-xs text-slate-400 space-y-2">
                        <p>1. Pilih platform yang ingin digunakan.</p>
                        <p>2. Masukkan URL konten yang ingin didownload.</p>
                        <p>3. Klik <span class="text-indigo-400 font-bold">Execute</span> untuk memproses.</p>
                        <p>4. Copy API endpoint untuk digunakan di aplikasi kamu.</p>
                    </div>
                </div>

            </div>
        </main>
    </div>
</body>
</html>