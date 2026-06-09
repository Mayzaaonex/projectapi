// ==================== SIDEBAR COMPONENT ====================
class Sidebar {
    static render(activePage = 'dashboard') {
        const sidebarHTML = `
            <!-- Hamburger Button -->
            <button class="hamburger-btn" onclick="Sidebar.toggle()">
                ☰
            </button>

            <!-- Overlay -->
            <div class="sidebar-overlay" id="sidebar-overlay" onclick="Sidebar.close()"></div>

            <!-- Sidebar -->
            <aside class="sidebar w-56 flex flex-col py-6 px-4 shrink-0" id="sidebar">
                <!-- Logo -->
                <div class="px-2 mb-8 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <a href="/" class="text-sm font-bold text-white tracking-tight no-underline hover:opacity-80 transition" onclick="Sidebar.close()">
                        API-MAYZAA
                    </a>
                </div>

                <!-- Navigation -->
                <nav class="flex flex-col gap-1 flex-1">
                    <div class="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Main Menu</div>
                    
                    <a href="/" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" onclick="Sidebar.close()">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Dashboard
                    </a>

                    <a href="/maker/" class="nav-link ${activePage === 'maker' ? 'active' : ''}" onclick="Sidebar.close()">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Maker API
                    </a>

                    <a href="/downloader/" class="nav-link ${activePage === 'downloader' ? 'active' : ''}" onclick="Sidebar.close()">
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
        `;

        document.getElementById('sidebar-container').innerHTML = sidebarHTML;
    }

    static toggle() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    static close() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}