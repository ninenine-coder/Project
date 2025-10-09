/**
 * 液態玻璃膠囊跑馬燈初始化
 * 自動無縫循環播放，依內容長度調整速度
 */
function initGlassMarquee() {
    document.querySelectorAll('.marquee.glass-pill').forEach($m => {
        const track = $m.querySelector('.marquee-track');
        if (!track) return;

        // 無縫：內容複製一份，寬度超過容器才能循環
        if (!track.dataset.cloned) {
            track.innerHTML = track.innerHTML + track.innerHTML;
            track.dataset.cloned = '1';
        }

        // 依內容長度調整動畫時長（越長越慢，避免太快）
        const totalWidth = Array.from(track.children)
            .reduce((w, el) => w + el.getBoundingClientRect().width + 28, 0);
        const sec = Math.max(18, Math.min(36, Math.round(totalWidth / 80)));
        track.style.animationDuration = sec + 's';

        // 輕量：視窗大小改變時重算一次
        let tid;
        window.addEventListener('resize', () => {
            clearTimeout(tid);
            tid = setTimeout(() => initGlassMarquee(), 200);
        }, { once: true });
    });
}

// 自動初始化（可選）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlassMarquee);
} else {
    // DOM 已經載入，直接執行
    initGlassMarquee();
}

// 導出函數供其他腳本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initGlassMarquee };
} else if (typeof window !== 'undefined') {
    window.initGlassMarquee = initGlassMarquee;
}

