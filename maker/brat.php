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
$stats['total_requests'] = ($stats['total_requests'] ?? 0) + 1;
$stats['credits_used'] = ($stats['credits_used'] ?? 0) + 1;
$stats['history'][] = ['time' => date('H:i:s'), 'count' => 1];
file_put_contents($statsFile, json_encode($stats));

$generatedImage = null;
$apiUrl = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['text'])) {
    $text = $_POST['text'];
    $bgColor = $_POST['bgColor'] ?? '8ACE00';
    $textColor = $_POST['textColor'] ?? '000000';
    
    $width = 1080;
    $height = 1080;
    $img = imagecreatetruecolor($width, $height);
    
    $bgR = hexdec(substr($bgColor, 0, 2));
    $bgG = hexdec(substr($bgColor, 2, 2));
    $bgB = hexdec(substr($bgColor, 4, 2));
    
    $textR = hexdec(substr($textColor, 0, 2));
    $textG = hexdec(substr($textColor, 2, 2));
    $textB = hexdec(substr($textColor, 4, 2));
    
    $bg = imagecolorallocate($img, $bgR, $bgG, $bgB);
    $txtColor = imagecolorallocate($img, $textR, $textG, $textB);
    
    imagefill($img, 0, 0, $bg);
    
    $fontSize = 80;
    $fontFile = __DIR__ . '/../public/fonts/arial.ttf';
    $textUpper = strtoupper($text);
    
    if (file_exists($fontFile)) {
        $bbox = imagettfbbox($fontSize, 0, $fontFile, $textUpper);
        $x = ($width - ($bbox[2] - $bbox[0])) / 2;
        $y = ($height - ($bbox[1] - $bbox[7])) / 2;
        imagettftext($img, $fontSize, 0, $x, $y, $txtColor, $fontFile, $textUpper);
    } else {
        $fontSize = 5;
        $fw = imagefontwidth($fontSize);
        $fh = imagefontheight($fontSize);
        $tw = strlen($textUpper) * $fw;
        $x = ($width - $tw) / 2;
        $y = ($height - $fh) / 2;
        imagestring($img, $fontSize, $x, $y, $textUpper, $txtColor);
    }
    
    ob_start();
    imagepng($img);
    $imageData = ob_get_clean();
    $generatedImage = 'data:image/png;base64,' . base64_encode($imageData);
    imagedestroy($img);
    
    $apiUrl = "https://{$_SERVER['HTTP_HOST']}/maker/brat?text=" . urlencode($text) . "&bgColor=" . urlencode($bgColor) . "&textColor=" . urlencode($textColor);
}
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brat Generator - Api-Mayzaa</title>
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
                    <h1 class="text-2xl font-bold text-white">🟢 Brat Generator</h1>
                    <p class="text-sm text-slate-400 mt-1">Buat teks gaya Brat dengan custom warna background & text.</p>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
                    <form method="POST">
                        <div class="mb-4">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Text</label>
                            <input type="text" name="text" required 
                                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                                placeholder="Masukkan teks..." 
                                value="<?php echo isset($_POST['text']) ? htmlspecialchars($_POST['text']) : ''; ?>">
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Background</label>
                                <div class="flex gap-2">
                                    <input type="color" 
                                        class="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent"
                                        value="#<?php echo isset($_POST['bgColor']) ? htmlspecialchars($_POST['bgColor']) : '8ACE00'; ?>"
                                        onchange="document.getElementById('bgColorInput').value = this.value.replace('#', '')">
                                    <input type="text" name="bgColor" id="bgColorInput"
                                        class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mono focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="8ACE00" 
                                        value="<?php echo isset($_POST['bgColor']) ? htmlspecialchars($_POST['bgColor']) : '8ACE00'; ?>">
                                </div>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Text Color</label>
                                <div class="flex gap-2">
                                    <input type="color" 
                                        class="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent"
                                        value="#<?php echo isset($_POST['textColor']) ? htmlspecialchars($_POST['textColor']) : '000000'; ?>"
                                        onchange="document.getElementById('textColorInput').value = this.value.replace('#', '')">
                                    <input type="text" name="textColor" id="textColorInput"
                                        class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mono focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="000000" 
                                        value="<?php echo isset($_POST['textColor']) ? htmlspecialchars($_POST['textColor']) : '000000'; ?>">
                                </div>
                            </div>
                        </div>

                        <button type="submit" 
                            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition active:scale-[0.98]">
                            ⚡ Execute
                        </button>
                    </form>
                </div>

                <?php if ($generatedImage): ?>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-white font-semibold">✅ Hasil Generate</h3>
                        <a href="<?php echo $generatedImage; ?>" download="brat.png" 
                            class="text-xs bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition">
                            📥 Download
                        </a>
                    </div>
                    
                    <div class="flex justify-center mb-6">
                        <img src="<?php echo $generatedImage; ?>" alt="Generated Brat" class="rounded-xl shadow-2xl" style="max-width: 400px; width: 100%;">
                    </div>
                    
                    <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <p class="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">🔗 API Endpoint</p>
                        <code class="text-sm text-green-400 mono break-all"><?php echo $apiUrl; ?></code>
                        <button onclick="copyToClipboard('<?php echo addslashes($apiUrl); ?>')" 
                            class="mt-3 text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                            📋 Copy URL
                        </button>
                    </div>
                </div>
                <?php endif; ?>

            </div>
        </main>
    </div>

    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                const toast = document.createElement('div');
                toast.textContent = '✅ Link API berhasil dicopy!';
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
    </script>
</body>
</html>