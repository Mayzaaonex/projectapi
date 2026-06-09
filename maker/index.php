<?php
$apiList = [
    [
        'name' => 'Brat Generator',
        'icon' => '🟢',
        'desc' => 'Buat teks gaya Brat dengan custom background & text color.',
        'endpoint' => '/maker/brat.php',
        'link' => 'brat.php'
    ],
    [
        'name' => 'Text Pro',
        'icon' => '📝',
        'desc' => 'Text styling premium dengan berbagai efek keren.',
        'endpoint' => '/maker/textpro.php',
        'link' => 'textpro.php'
    ],
    [
        'name' => 'Image Generator',
        'icon' => '🖼️',
        'desc' => 'Generate gambar AI dengan prompt custom.',
        'endpoint' => '/maker/image.php',
        'link' => 'image.php'
    ],
    [
        'name' => 'Sticker Maker',
        'icon' => '🌟',
        'desc' => 'Buat stiker WhatsApp dari gambar atau teks.',
        'endpoint' => '/maker/sticker.php',
        'link' => 'sticker.php'
    ]
];
?>
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maker API - Api-Mayzaa</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../public/style.css">
</head>
<body>
    <div class="flex h-screen overflow-hidden">
        
        <?php include '../inc/sidebar.php'; ?>

        <main class="flex-1 overflow-y-auto p-8">
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-white">⚙️ Maker API</h1>
                    <p class="text-sm text-slate-400 mt-1">Pilih endpoint maker yang tersedia.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <?php foreach ($apiList as $api): ?>
                    <a href="<?php echo $api['link']; ?>" class="api-menu-card">
                        <span class="text-3xl mb-3 block"><?php echo $api['icon']; ?></span>
                        <h3 class="text-white font-semibold text-sm mb-1"><?php echo $api['name']; ?></h3>
                        <p class="text-xs text-slate-500"><?php echo $api['desc']; ?></p>
                        <code class="text-[10px] bg-slate-950 text-slate-500 px-2 py-1 rounded mt-3 inline-block mono"><?php echo $api['endpoint']; ?></code>
                    </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>