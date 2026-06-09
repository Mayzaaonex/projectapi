    <!-- Toast Container -->
    <div id="toast-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;"></div>

    <script>
        // ==================== COPY TO CLIPBOARD ====================
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('✅ Link API berhasil dicopy!', 'success');
            }).catch(() => {
                showToast('❌ Gagal copy!', 'error');
            });
        }

        // ==================== TOAST NOTIFICATION ====================
        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            
            const bgColor = type === 'success' ? '#22c55e' : '#ef4444';
            const textColor = '#000';
            
            toast.textContent = message;
            toast.style.cssText = `
                background: ${bgColor};
                color: ${textColor};
                padding: 12px 20px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 13px;
                animation: fadeInUp 0.3s ease;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                min-width: 250px;
            `;
            
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        }

        // ==================== THEME TOGGLE ====================
        function toggleTheme() {
            document.documentElement.classList.toggle('light');
            const isLight = document.documentElement.classList.contains('light');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        }

        // Load theme
        (function() {
            if (localStorage.getItem('theme') === 'light') {
                document.documentElement.classList.add('light');
            }
        })();

        // ==================== BACK TO TOP ====================
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top');
            if (btn) {
                btn.style.display = window.scrollY > 300 ? 'block' : 'none';
            }
        });

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // ==================== ESC CLOSE MODAL ====================
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('modal-overlay');
                if (modal && modal.classList.contains('show')) {
                    modal.classList.remove('show');
                }
            }
        });
    </script>

    <!-- Back to Top Button -->
    <button id="back-to-top" onclick="scrollToTop()" 
        style="display: none; position: fixed; bottom: 20px; left: 240px; 
               background: #6366f1; color: #fff; border: none; 
               width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
               font-size: 18px; z-index: 50; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
               transition: all 0.3s ease;">
        ↑
    </button>

</body>
</html>