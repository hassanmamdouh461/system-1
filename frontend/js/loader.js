document.addEventListener("DOMContentLoaded", () => {
    // Check navigation type (Reload vs Navigate)
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navigationEntry ? navigationEntry.type === 'reload' : false;
    
    // Check session storage
    const hasPlayed = sessionStorage.getItem('introShown');

    // Show animation ONLY if:
    // 1. It's a page reload (Refresh)
    // 2. OR it hasn't played yet in this session (First visit)
    if (isReload || !hasPlayed) {
        // Mark as played
        sessionStorage.setItem('introShown', 'true');
        
        // Inject HTML
        const loaderHTML = `
        <div class="loader-overlay" id="loaderOverlay">
            <div class="particles" id="particles"></div>
            <div class="loader-container">
                <div class="logo-box">
                    <i class="fa-solid fa-cash-register logo-icon-anim"></i>
                </div>
                <h1 class="loader-title">نظام الكاشير المتطور</h1>
                <p class="loader-subtitle" id="loaderSubtitle">جاري تجهيز بيئة العمل...</p>
                <div class="progress-bar"></div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', loaderHTML);

        // Create Particles
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                const size = Math.random() * 5 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particlesContainer.appendChild(particle);
            }
        }

        // Animation Logic
        setTimeout(() => {
            const subtitle = document.getElementById('loaderSubtitle');
            if(subtitle) {
                subtitle.textContent = "مرحباً بك 👋";
                subtitle.style.color = "#10b981";
            }
            
            setTimeout(() => {
                const overlay = document.getElementById('loaderOverlay');
                if(overlay) {
                    overlay.classList.add('hidden');
                    setTimeout(() => {
                        overlay.remove();
                    }, 500); // Wait for fade out
                }
            }, 800);
        }, 2000); // Slightly faster for better UX
    }
});
