<?php
$currentUri = $_SERVER['REQUEST_URI'];
$currentPage = basename($_SERVER['PHP_SELF']);
$currentDir = basename(dirname($_SERVER['PHP_SELF']));
?>
<aside class="sidebar w-56 flex flex-col py-6 px-4 shrink-0">
    <!-- Logo -->
    <div class="px-2 mb-8 flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <a href="/api-dashboard/index.php" class="text-sm font-bold text-white tracking-tight no-underline hover:opacity-80 transition">
            API-MAYZAA
        </a>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1 flex-1">
        <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Main Menu</div>
        
        <!-- Dashboard -->
        <a href="/api-dashboard/index.php" 
           class="nav-link <?php echo ($currentPage == 'index.php' && $currentDir != 'maker') ? 'active' : ''; ?>">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
            </svg>
            Dashboard
        </a>

        <!-- Maker -->
        <a href="/api-dashboard/maker/index.php" 
           class="nav-link <?php echo ($currentDir == 'maker') ? 'active' : ''; ?>">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Maker API
        </a>

        <!-- Downloader -->
        <a href="/api-dashboard/downloader/index.php" 
           class="nav-link <?php echo ($currentDir == 'downloader') ? 'active' : ''; ?>">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Downloader
        </a>
    </nav>

    <!-- Footer -->
    <div class="text-[10px] text-slate-700 px-2">
        Copyright © RianModss
    </div>
</aside>