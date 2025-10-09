/**
 * Glass System Feature Detection
 * GitHub Pages 兼容的特性检测脚本
 * 
 * 检测 backdrop-filter 和 mask 支持，自动添加相应的 CSS 类
 * 确保液态玻璃效果在所有环境下都能正常工作
 */

(function () {
    'use strict';
    
    const root = document.documentElement;

    // 1) 测试 backdrop-filter（液态玻璃）
    const supportBackdrop =
        CSS.supports('backdrop-filter', 'blur(1px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(1px)');

    // 2) 测试 mask（瓶盖齿圈）
    const supportMask =
        CSS.supports('mask', 'radial-gradient(black, transparent)') ||
        CSS.supports('-webkit-mask', 'radial-gradient(black, transparent)');

    // 添加相应的 CSS 类
    root.classList.toggle('support-backdrop', supportBackdrop);
    root.classList.toggle('no-backdrop', !supportBackdrop);
    root.classList.toggle('support-mask', supportMask);
    root.classList.toggle('no-mask', !supportMask);

    // 调试信息（开发环境）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔍 Glass System Feature Detection:');
        console.log(`  backdrop-filter: ${supportBackdrop ? '✅ 支持' : '❌ 不支持'}`);
        console.log(`  mask: ${supportMask ? '✅ 支持' : '❌ 不支持'}`);
        console.log('  自动应用相应的回退方案');
    }
})();

/**
 * Glass Glow Effect (可选)
 * 为 .glass--glow 元素添加鼠标跟随光效
 */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.glass--glow').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`);
            el.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`);
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--x', '50%');
            el.style.setProperty('--y', '50%');
        });
    });
});
