# 難度圖標功能說明

## 📊 功能概述

每道筆試測驗題目的左上角會顯示對應的難度圖標，幫助學習者了解題目的難易程度。

## 🎨 難度等級

系統支持三種難度等級：

| 難度 | 英文標識 | 圖標文件 | 說明 |
|------|---------|---------|------|
| 易 | `easy` | `assets/難易度 易.png` | 基礎題目，適合初學者 |
| 中 | `medium` | `assets/難易度 中.png` | 中等難度，需要一定理解 |
| 難 | `hard` | `assets/難易度 難.png` | 進階題目，需要深入思考 |

## 💡 實現細節

### 1. CSS 樣式
- **位置**: 題目容器右側，垂直居中（`right: 20px, top: 50%`）
- **布局**: 垂直排列（圖標在上，文字在下）
- **圖標尺寸**: 70x70 像素（響應式調整）
- **文字標籤**: 
  - 易（綠色邊框）：`#27ae60`
  - 中（橙色邊框）：`#f39c12`
  - 難（紅色邊框）：`#e74c3c`
- **動畫**: 
  - 入場動畫：淡入效果
  - 懸停效果：整體放大 1.1 倍
  - 陰影效果：增強視覺層次

### 2. JavaScript 邏輯
```javascript
// 根據難度獲取圖標路徑
function getDifficultyIcon(difficulty) {
    const difficultyMap = {
        'easy': 'assets/難易度 易.png',
        'medium': 'assets/難易度 中.png',
        'hard': 'assets/難易度 難.png'
    };
    return difficultyMap[difficulty] || 'assets/難易度 中.png';
}

// 根據難度獲取中文標籤
function getDifficultyLabel(difficulty) {
    const labelMap = {
        'easy': '易',
        'medium': '中',
        'hard': '難'
    };
    return labelMap[difficulty] || '中';
}

// 顯示難度圖標和文字標籤
function displayDifficultyBadge(difficulty) {
    // 創建難度容器（包含圖標和文字）
    const container = document.createElement('div');
    container.className = 'difficulty-container';
    
    // 創建難度圖標
    const badge = document.createElement('img');
    badge.className = 'difficulty-badge';
    badge.src = getDifficultyIcon(difficulty);
    
    // 創建難度文字標籤
    const label = document.createElement('div');
    label.className = `difficulty-label ${difficulty}`;
    label.textContent = getDifficultyLabel(difficulty);
    
    // 組裝並添加到題目區域
    container.appendChild(badge);
    container.appendChild(label);
    questionText.appendChild(container);
}
```

### 3. 題目 JSON 格式
每道題目都包含 `difficulty` 字段：

```json
{
    "id": 1,
    "question": "在進行CPR時，正確的按壓深度應該是？",
    "options": ["至少5公分", "至少3公分", "至少7公分", "至少10公分"],
    "correct": 0,
    "explanation": "根據最新CPR指南，成人CPR的按壓深度應至少5公分，但不超過6公分。",
    "difficulty": "easy"
}
```

## 🔄 功能整合

難度圖標會在以下場景中顯示：

1. ✅ **初次載入題目** - `displayQuestionWithDelay()`
2. ✅ **語言切換時** - `displayQuestionForLanguageSwitch()`
3. ✅ **語言切換後下一題** - `displayQuestionAfterLanguageSwitch()`
4. ✅ **一般題目顯示** - `displayQuestion()`

## 📁 相關文件

- **主程式**: `exam_quiz.html` (第370-395行：CSS樣式，第1392-1420行：JavaScript邏輯)
- **中文題庫**: `data/questions.json` (200題，每題都有 difficulty 字段)
- **英文題庫**: `data/questions_en.json` (20題，每題都有 difficulty 字段)
- **圖標資源**: `assets/難易度 易.png`, `assets/難易度 中.png`, `assets/難易度 難.png`

## 🎯 使用效果

當學習者進行筆試測驗時：
1. 每道題目**右側**會自動顯示難度圖標和文字標籤
2. 圖標在上，文字標籤在下（易/中/難）
3. 圖標和標籤會有平滑的淡入動畫效果
4. 滑鼠懸停時整體會輕微放大
5. 不同難度顯示不同顏色的邊框：
   - 易：綠色邊框
   - 中：橙色邊框
   - 難：紅色邊框
6. 響應式設計，在小屏幕上自動縮小以避免遮擋題目

## ✨ 特色優勢

- **視覺直觀**: 一眼就能看出題目難度
- **學習引導**: 幫助學習者合理分配答題時間
- **美觀動效**: 圖標動畫提升使用體驗
- **雙語支持**: 中英文題庫都支持難度顯示
- **自動適應**: 語言切換時難度圖標自動更新

## 🔧 技術細節

### 圖標定位
使用 `position: absolute` 相對於題目容器定位，確保圖標始終在右側垂直居中。

### 布局結構
```html
<div id="question-text">
    題目文字內容...
    <div class="difficulty-container">
        <img class="difficulty-badge" src="..." />
        <div class="difficulty-label">易/中/難</div>
    </div>
</div>
```

### 動畫時序
- **入場動畫**: 0.6秒淡入效果
- **懸停動畫**: 0.3秒過渡時間，放大至 1.1 倍

### 響應式斷點
- **桌面版** (>768px): 圖標 70x70px，文字 16px
- **平板版** (≤768px): 圖標 50x50px，文字 14px
- **手機版** (≤480px): 圖標 40x40px，文字 12px

### 容錯處理
- 如果題目沒有 difficulty 字段，系統會跳過圖標顯示
- 如果 difficulty 值不在預設範圍，會使用默認的中等難度圖標

## 📝 維護說明

### 添加新難度等級
1. 在 `assets/` 文件夾添加新圖標
2. 更新 `getDifficultyIcon()` 函數的 `difficultyMap` 對象
3. 在題目 JSON 中使用新的 difficulty 標識

### 修改圖標樣式
編輯 `exam_quiz.html` 第373-439行的 CSS 樣式：
- 調整圖標尺寸：修改 `.difficulty-badge` 的 `width` 和 `height`
- 調整容器位置：修改 `.difficulty-container` 的 `right` 和 `top`
- 調整文字標籤：修改 `.difficulty-label` 的字體大小和邊框顏色
- 調整動畫：修改 `@keyframes difficultyAppear`
- 調整響應式：修改 `@media` 查詢中的相關樣式

---

**版本**: 1.0.0  
**更新日期**: 2025-10-08  
**作者**: PBLS VR教學平台開發團隊

