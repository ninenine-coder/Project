# 🔧 液態玻璃 GitHub Pages 修復指南

## ✅ 已完成的修復

### 1️⃣ 核心問題解決
- **問題**: `mix-blend-mode: overlay` 在 GitHub Pages 上導致變暗
- **解決**: 統一使用 `mix-blend-mode: screen`（只會變亮，不會變暗）

### 2️⃣ 主要修改內容

#### **vite.config.js**
```javascript
css: {
  postcss: {
    plugins: [
      {
        postcssPlugin: 'internal:preserve-backdrop-filter',
        Declaration(decl) {
          if (decl.prop === 'backdrop-filter' || decl.prop === '-webkit-backdrop-filter') {
            decl.important = false;
          }
        }
      }
    ]
  }
}
```

#### **team.html - 液態玻璃樣式**
```css
.team-member-card.liquid-glass {
  /* ✅ 淡白底，避免被視作黑幕 */
  background: rgba(255, 255, 255, 0.12);
  
  /* ✅ 真的玻璃感 */
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  backdrop-filter: blur(18px) saturate(160%);
  
  /* 🔒 限制混色範圍，避免和整個頁面混色導致變暗 */
  isolation: isolate;
}

/* ✅ 統一只做「變亮」效果 */
.team-member-card.liquid-glass::before,
.team-member-card.liquid-glass::after {
  mix-blend-mode: screen !important;
}
```

### 3️⃣ 關鍵技術點

| 技術 | 作用 | 為什麼重要 |
|------|------|-----------|
| `isolation: isolate;` | 限制混色範圍 | 避免與整個頁面背景混色導致變暗 |
| `mix-blend-mode: screen` | 只做加亮效果 | 不像 overlay 會壓暗中間調 |
| `background: rgba(255,255,255,0.12)` | 淡白底色 | 避免被瀏覽器視作黑色背景 |
| `color-scheme: light` | 強制亮色方案 | 避免系統暗色主題干擾 |

---

## 🚀 部署步驟

### 步驟 1: 重新構建
```bash
# 方法 1: PowerShell (需要管理員權限)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm run build

# 方法 2: CMD
cmd /c npm run build

# 方法 3: 使用批次檔
.\deploy.bat
```

### 步驟 2: 部署到 GitHub Pages
構建完成後，將 `dist` 資料夾內容推送到 GitHub Pages。

### 步驟 3: 強制刷新快取
GitHub Pages 很會吃快取，部署後請：
- **Windows**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- 或開啟無痕模式測試

---

## 🔍 驗證方法

### 1. 檢查 CSS 是否保留
1. 在 GitHub Pages 開啟網頁
2. 右鍵點擊團隊成員卡片 → **檢查元素**
3. 查看右側 **Computed** 或 **Styles** 面板

應該看到：
```css
✅ backdrop-filter: blur(18px) saturate(160%);
✅ -webkit-backdrop-filter: blur(18px) saturate(160%);
✅ isolation: isolate;
✅ mix-blend-mode: screen;
```

### 2. 視覺效果檢查
- [ ] 卡片應該是**半透明白色玻璃質感**
- [ ] 背景應該**可透視**，不是黑霧或灰塊
- [ ] 滑鼠移過時有**跟隨的高光效果**
- [ ] hover 時有**微微浮起的動畫**

### 3. 如果還是有問題
截圖給我看以下內容：
1. DevTools 的 **Computed Styles** 面板
2. 網頁實際顯示的樣子
3. 瀏覽器版本和操作系統

---

## 📊 修改文件清單

- ✅ `vite.config.js` - 添加 PostCSS 插件保留 backdrop-filter
- ✅ `team.html` - 更新液態玻璃樣式為安全版本
  - 修改 `.team-member-card.liquid-glass` 主容器
  - 修改 `::before` 和 `::after` 偽元素
  - 更新動畫定義
  - 添加 `html { color-scheme: light; }`
  - 更新兼容性回退

---

## 💡 常見問題

**Q: 為什麼 VS Code 正常但 GitHub Pages 有問題？**
- VS Code Live Server 不會壓縮 CSS
- GitHub Pages 會經過 Vite 打包和壓縮
- 壓縮過程中 `mix-blend-mode: overlay` 會與不同色彩管理產生衝突

**Q: isolation: isolate 是什麼？**
- 創建一個獨立的堆疊上下文
- 防止混色效果擴散到父元素
- 確保混色只在容器內生效

**Q: 為什麼要用 screen 而不是 overlay？**
- `screen`: 只會變亮，安全
- `overlay`: 會壓暗中間調，在不同環境下不穩定
- `multiply`: 會變暗，不適合玻璃效果

---

## 🎨 微調建議

如果覺得效果太淡或太濃，可以調整：

```css
/* 更透明（背景更清晰） */
background: rgba(255, 255, 255, 0.06);

/* 更不透明（更白） */
background: rgba(255, 255, 255, 0.18);

/* 模糊更強 */
backdrop-filter: blur(25px) saturate(160%);

/* 模糊更弱 */
backdrop-filter: blur(12px) saturate(160%);
```

---

## 📝 技術總結

這次修復的核心是：
1. 🎯 **找到真正問題**: 不是 `backdrop-filter` 被刪，而是 `mix-blend-mode` 混色導致變暗
2. 🛠️ **使用安全混色**: `screen` 只會變亮，不會變暗
3. 🔒 **隔離混色範圍**: `isolation: isolate` 避免與頁面混色
4. 🎨 **淡白底色**: 避免被識別為黑色背景

修復後應該在所有環境（本地、GitHub Pages、不同瀏覽器）都能呈現一致的液態玻璃效果！✨

