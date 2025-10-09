// GitHub Pages 液態玻璃效果調試腳本
// 在瀏覽器 Console 中運行此腳本，檢查液態玻璃支援狀況

console.log('🔍 GitHub Pages 液態玻璃效果調試');
console.log('================================');

// 檢查 backdrop-filter 支援
const backdropSupport = CSS.supports('backdrop-filter', 'blur(1px)') || 
                       CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
console.log(`✨ backdrop-filter 支援: ${backdropSupport ? '✅ 有' : '❌ 無'}`);

// 檢查 mask 支援
const maskSupport = CSS.supports('mask', 'radial-gradient(black, transparent)') || 
                   CSS.supports('-webkit-mask', 'radial-gradient(black, transparent)');
console.log(`🎭 mask 支援: ${maskSupport ? '✅ 有' : '❌ 無'}`);

// 檢查頁面上的 CSS 類別
const root = document.documentElement;
const hasSupportBackdrop = root.classList.contains('support-backdrop');
const hasNoBackdrop = root.classList.contains('no-backdrop');
const hasSupportMask = root.classList.contains('support-mask');
const hasNoMask = root.classList.contains('no-mask');

console.log('📋 CSS 類別狀態:');
console.log(`  .support-backdrop: ${hasSupportBackdrop ? '✅' : '❌'}`);
console.log(`  .no-backdrop: ${hasNoBackdrop ? '✅' : '❌'}`);
console.log(`  .support-mask: ${hasSupportMask ? '✅' : '❌'}`);
console.log(`  .no-mask: ${hasNoMask ? '✅' : '❌'}`);

// 檢查液態玻璃元素
const glassElements = document.querySelectorAll('.glass, .glass-card, .marquee.glass-pill, .liquid-glass');
console.log(`\n🔍 找到 ${glassElements.length} 個液態玻璃元素:`);
glassElements.forEach((el, i) => {
    const computedStyle = window.getComputedStyle(el);
    const backdropFilter = computedStyle.backdropFilter;
    const webkitBackdropFilter = computedStyle.webkitBackdropFilter;
    
    console.log(`  ${i + 1}. ${el.className}`);
    console.log(`     backdrop-filter: ${backdropFilter}`);
    console.log(`     -webkit-backdrop-filter: ${webkitBackdropFilter}`);
});

// 檢查瓶蓋元素
const bottleCaps = document.querySelectorAll('.bottle-cap');
console.log(`\n🍾 找到 ${bottleCaps.length} 個瓶蓋元素:`);
bottleCaps.forEach((el, i) => {
    const beforeElement = window.getComputedStyle(el, '::before');
    const display = beforeElement.display;
    
    console.log(`  ${i + 1}. ${el.className}`);
    console.log(`     ::before display: ${display}`);
});

// 建議修復方案
console.log('\n🛠️ 建議修復方案:');
if (!backdropSupport) {
    console.log('  ❌ backdrop-filter 不支援 → 應顯示半透明回退');
}
if (!maskSupport) {
    console.log('  ❌ mask 不支援 → 瓶蓋齒圈應隱藏');
}

console.log('\n📝 如果效果異常，請檢查:');
console.log('  1. CSS 載入順序是否正確');
console.log('  2. 是否有其他 CSS 規則覆蓋');
console.log('  3. 硬體加速是否開啟');
console.log('  4. 瀏覽器版本是否支援');

console.log('\n🎯 調試完成！');
