# 🌀 瓶蓋 3D 翻轉動畫 - 完成指南

## ✅ 功能完成狀態

團隊成員的瓶蓋頭像已成功添加 **3D 扭轉翻面動畫**功能！

---

## 🎯 功能特點

### 1. **互動方式**
- ✅ **點擊瓶蓋** → 旋轉扭開，翻轉到背面顯示聯絡資訊
- ✅ **再次點擊** → 蓋回去，回到正面
- ✅ **鍵盤支持** → Enter 或 Space 鍵觸發
- ✅ **觸控支持** → 行動裝置可正常使用
- ✅ **無障礙** → tabindex、role、aria-expanded 完整支持

### 2. **動畫效果**
- 🌀 **扭開動畫** - 0.9秒 Y軸翻轉 + Z軸扭轉 (-540°)
- 🔒 **蓋回動畫** - 0.7秒 回轉 + Z軸旋轉 (360°)
- 💫 **輕微抬升** - translateY 營造立體感
- 🎨 **流暢曲線** - cubic-bezier 緩動函數

### 3. **無障礙支持**
- ✅ `tabindex="0"` - 可用鍵盤聚焦
- ✅ `role="button"` - 語義化角色
- ✅ `aria-expanded` - 狀態提示
- ✅ `aria-label` - 操作說明
- ✅ `focus-visible` - 焦點視覺反饋
- ✅ `prefers-reduced-motion` - 尊重用戶偏好

---

## 📋 成員資訊

| 成員 | 瓶蓋顏色 | 職位 | 聯絡方式 |
|------|---------|------|---------|
| 周哲旭 | 🔵 藍灰 | 專案經理 | ✅ 已設置 |
| 潘蓁樺 | 🌸 粉紅 | 技術開發 | ✅ 已設置 |
| 邱子芸 | 🌊 青綠 | UI/UX 設計師 | ✅ 已設置 |
| 謝昕璦 | 🌾 米黃 | 內容企劃 | ✅ 已設置 |
| 林立凡 | 💜 淡紫 | 行銷專員 | ✅ 已設置 |

---

## 💻 核心代碼

### HTML 結構
```html
<div class="cap-card">
  <div class="cap-3d" tabindex="0" role="button" aria-expanded="false">
    <!-- 正面（瓶蓋） -->
    <div class="cap-face cap-front">
      <div class="bottle-cap">
        <div class="bottle-cap__face"></div>
        <div class="bottle-cap__photo">
          <img src="照片.png" alt="成員">
        </div>
      </div>
    </div>

    <!-- 背面（聯絡資訊） -->
    <div class="cap-face cap-back">
      <div class="cap-back-inner">
        <h4>姓名</h4>
        <p class="title">職位</p>
        <div class="contact">
          <a href="mailto:xxx"><i class="fas fa-envelope"></i> Email</a>
          <a href="tel:xxx"><i class="fas fa-phone"></i> Phone</a>
          <a href="xxx"><i class="fab fa-line"></i> LINE</a>
        </div>
      </div>
    </div>
  </div>
  <h3>姓名</h3>
  <p>職位</p>
</div>
```

### CSS 關鍵樣式
```css
/* 3D 透視容器 */
.cap-3d {
    perspective: 1200px;
    transform-style: preserve-3d;
}

/* 正面和背面 */
.cap-face {
    backface-visibility: hidden;
    transition: transform 0.9s cubic-bezier(0.22, 0.85, 0.25, 1);
}

.cap-front { transform: rotateY(0deg); }
.cap-back { transform: rotateY(180deg); }

/* 開啟時翻轉 */
.cap-3d.is-open .cap-front { transform: rotateY(-180deg); }
.cap-3d.is-open .cap-back { transform: rotateY(0deg); }
```

### JavaScript 控制
```javascript
function initCapFlip() {
    document.querySelectorAll('.cap-3d').forEach(el => {
        const toggle = () => {
            const open = el.classList.toggle('is-open');
            el.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (!open) {
                el.classList.add('closing');
                setTimeout(() => el.classList.remove('closing'), 700);
            }
        };

        el.addEventListener('click', toggle);
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });
}
```

---

## 🎨 動畫細節

### 扭開動畫 (twist-open)
```css
@keyframes twist-open {
    0%   { transform: rotateY(0) rotateZ(0) translateY(0); }
    40%  { transform: rotateY(-30deg) rotateZ(-220deg) translateY(-4px); }
    100% { transform: rotateY(-180deg) rotateZ(-540deg) translateY(0); }
}
```

**效果解析:**
- 0% → 40%: 先稍微反轉 + 快速扭轉 + 微抬起
- 40% → 100%: 繼續翻轉到背面 + 完成扭轉 + 落下

### 蓋回動畫 (twist-close)
```css
@keyframes twist-close {
    0%   { transform: rotateY(-180deg) rotateZ(0deg) translateY(0); }
    50%  { transform: rotateY(-130deg) rotateZ(180deg) translateY(-3px); }
    100% { transform: rotateY(0) rotateZ(360deg) translateY(0); }
}
```

**效果解析:**
- 0% → 50%: 開始回轉 + 扭轉半圈 + 微抬起
- 50% → 100%: 完全回到正面 + 扭轉一整圈 + 落下

---

## 🔧 自定義調整

### 調整翻轉速度

#### 更快
```css
.cap-face {
    transition: transform 0.6s cubic-bezier(0.22, 0.85, 0.25, 1);
}
```

#### 更慢
```css
.cap-face {
    transition: transform 1.2s cubic-bezier(0.22, 0.85, 0.25, 1);
}
```

### 調整透視距離

#### 更立體（近距離透視）
```css
.cap-3d {
    perspective: 800px;
}
```

#### 更平面（遠距離透視）
```css
.cap-3d {
    perspective: 1600px;
}
```

### 調整扭轉角度

```css
@keyframes twist-open {
    40%  { transform: rotateY(-30deg) rotateZ(-360deg) translateY(-4px); }
    100% { transform: rotateY(-180deg) rotateZ(-720deg) translateY(0); }
}
```

### 修改背面樣式

```css
.cap-back-inner {
    /* 改為其他配色 */
    background: rgba(102, 126, 234, 0.2);  /* 紫色調 */
    
    /* 改為更不透明 */
    background: rgba(255, 255, 255, 0.25);
    
    /* 改為深色背景 */
    background: rgba(30, 41, 59, 0.85);
}
```

---

## 📱 響應式設計

| 螢幕寬度 | 容器尺寸 | 瓶蓋尺寸 | 效果 |
|---------|---------|---------|------|
| > 768px | 220x220px | 180px | ✅ 完整效果 |
| ≤ 768px | 200x200px | 120px | ✅ 自動縮放 |

---

## ♿ 無障礙支持

### 鍵盤操作
- **Tab** - 聚焦到瓶蓋
- **Enter / Space** - 觸發翻轉
- **Tab** - 移動到下一個元素

### 螢幕閱讀器
- 會朗讀："查看 [成員名稱] 聯絡資訊，按鈕，未展開"
- 翻轉後："查看 [成員名稱] 聯絡資訊，按鈕，已展開"

### 減少動畫模式
```css
@media (prefers-reduced-motion: reduce) {
    .cap-face {
        transition: none !important;
        animation: none !important;
    }
}
```

用戶若在系統設置中啟用「減少動畫」，翻轉將直接切換，無動畫。

---

## 🎮 使用示範

### 操作流程
1. **點擊瓶蓋** 或按 **Enter** 鍵
2. 瓶蓋開始**扭轉旋轉** (0.4秒)
3. 繼續翻轉到背面 (0.5秒)
4. 顯示**聯絡資訊**
5. 再次點擊 → 蓋回去

### 視覺效果
- 🌀 Z軸扭轉：-540° (1.5圈)
- 🔄 Y軸翻轉：-180° (翻面)
- ⬆️ 輕微抬升：-4px
- 💫 陰影加深：營造懸浮感

---

## 🔍 背面資訊配置

### 當前設置
```html
<div class="contact">
    <a href="mailto:xxx@example.com">
        <i class="fas fa-envelope"></i> xxx@example.com
    </a>
    <a href="tel:+886912345678">
        <i class="fas fa-phone"></i> +886 912-345-678
    </a>
    <a href="https://line.me/ti/p/xxx" target="_blank">
        <i class="fab fa-line"></i> LINE: xxx
    </a>
</div>
```

### 添加更多聯絡方式
```html
<!-- GitHub -->
<a href="https://github.com/username" target="_blank">
    <i class="fab fa-github"></i> GitHub
</a>

<!-- Instagram -->
<a href="https://instagram.com/username" target="_blank">
    <i class="fab fa-instagram"></i> Instagram
</a>

<!-- LinkedIn -->
<a href="https://linkedin.com/in/username" target="_blank">
    <i class="fab fa-linkedin"></i> LinkedIn
</a>
```

---

## 🎨 配色方案

每位成員使用不同的瓶蓋顏色：

### 配色表
```css
/* 藍灰色（默認） */
--cap-color: #e7eef6;
--cap-edge: #cfd9e6;

/* 粉紅色 */
--cap-color: #f4e6e6;
--cap-edge: #e3d1d1;

/* 青綠色 */
--cap-color: #e6f4f1;
--cap-edge: #d1e8e3;

/* 米黃色 */
--cap-color: #f4f0e6;
--cap-edge: #e8e3d1;

/* 淡紫色 */
--cap-color: #ebe6f4;
--cap-edge: #ddd1e8;
```

### 添加新配色
```html
<!-- 薄荷綠 -->
<div class="bottle-cap" style="--cap-color:#e0f5f0; --cap-edge:#c8e8df;">

<!-- 桃粉色 -->
<div class="bottle-cap" style="--cap-color:#ffe6f0; --cap-edge:#ffd1e3;">

<!-- 天藍色 -->
<div class="bottle-cap" style="--cap-color:#e0f0ff; --cap-edge:#c8dfff;">
```

---

## 🔧 進階自定義

### 1. 調整翻轉方向

#### 從右往左翻
```css
.cap-3d.is-open .cap-front { transform: rotateY(180deg) translateZ(0); }
.cap-3d.is-open .cap-back { transform: rotateY(360deg) translateZ(0); }
```

#### X 軸翻轉（上下翻）
```css
.cap-back { transform: rotateX(180deg) translateZ(0); }
.cap-3d.is-open .cap-front { transform: rotateX(-180deg); }
.cap-3d.is-open .cap-back { transform: rotateX(0deg); }
```

### 2. 調整背面內容

```css
.cap-back-inner {
    /* 更多內容時增加 padding */
    padding: 24px;
    
    /* 改變背景顏色 */
    background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.2) 0%, 
        rgba(118, 75, 162, 0.2) 100%);
    
    /* 調整字體大小 */
    font-size: 14px;
}
```

### 3. 添加點擊提示

```css
.cap-3d::after {
    content: "點擊查看資訊";
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #6b7280;
    opacity: 0;
    transition: opacity 0.3s;
}

.cap-3d:hover::after {
    opacity: 1;
}
```

---

## 🎬 動畫時間軸

### 扭開動畫 (0.9秒)
```
0.0s → 0.4s (40%) : 預備扭轉，快速旋轉 Z軸 -220°，微抬起
0.4s → 0.9s (60%) : 繼續翻轉至背面，扭轉至 -540°，落下
```

### 蓋回動畫 (0.7秒)
```
0.0s → 0.35s (50%) : 回轉開始，Z軸扭回 180°，微抬起
0.35s → 0.7s (50%) : 回到正面，完成 360° 旋轉，落下
```

---

## 📊 性能優化

### 已實現的優化
- ✅ `transform-style: preserve-3d` - 啟用硬體加速
- ✅ `will-change: transform` - 提示瀏覽器優化
- ✅ `backface-visibility: hidden` - 隱藏背面減少渲染
- ✅ `isolation: isolate` - 獨立渲染層

### GPU 加速驗證
所有動畫使用 `transform`，不觸發 reflow：
- ✅ `rotateY()` - GPU 加速
- ✅ `rotateZ()` - GPU 加速
- ✅ `translateY()` - GPU 加速
- ❌ 不使用 `top`、`left` 等觸發 reflow 的屬性

---

## 🐛 常見問題

### Q1: 翻轉時看到背面文字反向？
**A**: 確保 `backface-visibility: hidden;` 已設置
```css
.cap-face {
    backface-visibility: hidden;
}
```

### Q2: 動畫卡頓？
**A**: 檢查是否使用了 GPU 加速
```css
.cap-face {
    transform: translateZ(0);  /* 強制啟用 GPU */
}
```

### Q3: 點擊無反應？
**A**: 檢查 JavaScript 是否正確初始化
```javascript
document.addEventListener('DOMContentLoaded', function() {
    initCapFlip();  // 確保此行存在
});
```

### Q4: 背面內容溢出？
**A**: 調整背面內容的 padding 和 font-size
```css
.cap-back-inner {
    padding: 16px;
    font-size: 13px;
}
```

### Q5: 鍵盤無法聚焦？
**A**: 確保有 `tabindex="0"`
```html
<div class="cap-3d" tabindex="0" role="button">
```

---

## 📱 移動裝置優化

### 觸控優化
```css
.cap-3d {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}
```

### 防止誤觸
```javascript
let touchStartTime;
el.addEventListener('touchstart', () => {
    touchStartTime = Date.now();
});

el.addEventListener('touchend', (e) => {
    if (Date.now() - touchStartTime < 500) {
        toggle();
    }
});
```

---

## 🎯 實際應用建議

### 1. 更新真實聯絡資訊
```html
<div class="contact">
    <a href="mailto:real@email.com"><i class="fas fa-envelope"></i> real@email.com</a>
    <a href="tel:+886912345678"><i class="fas fa-phone"></i> +886 912-345-678</a>
    <a href="https://line.me/ti/p/realid" target="_blank" rel="noopener"><i class="fab fa-line"></i> LINE: realid</a>
</div>
```

### 2. 添加社交媒體
```html
<div class="contact">
    <!-- 現有聯絡方式 -->
    <a href="https://github.com/username"><i class="fab fa-github"></i> GitHub</a>
    <a href="https://instagram.com/username"><i class="fab fa-instagram"></i> Instagram</a>
</div>
```

### 3. 自定義職位描述
```html
<p class="title">前端工程師 | React 專家</p>
```

---

## 🎉 總結

### 完成成就
- ✅ **5 位成員**全部添加 3D 翻轉功能
- ✅ **正面**顯示寶特瓶蓋頭像
- ✅ **背面**顯示聯絡資訊
- ✅ **扭轉動畫**流暢自然
- ✅ **鍵盤支持**完整
- ✅ **無障礙**符合標準
- ✅ **響應式**完美適配

### 技術亮點
- 🌀 創新的扭轉翻面動畫
- 💫 複合 transform 動畫（rotateY + rotateZ + translateY）
- 🎨 每位成員獨特配色
- ⚡ GPU 硬體加速
- ♿ 完整無障礙支持

---

**瓶蓋可以點擊翻轉查看聯絡資訊了！** 🎊

點擊任何一個瓶蓋，享受流暢的 3D 扭轉翻面動畫吧！✨

