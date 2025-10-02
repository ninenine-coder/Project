# React i18n 國際化組件

這是一個使用 React + react-i18next 實現的 PBLS 知識庫國際化組件。

## 🚀 功能特色

- ✅ **雙語支援**：中文/英文切換
- ✅ **動態翻譯**：所有文字內容使用 `t('key')` 方式讀取
- ✅ **圖片切換**：流程圖和情境圖片根據語言自動切換
- ✅ **語言切換按鈕**：右上角浮動按鈕，可即時切換語言
- ✅ **動畫效果**：使用 Framer Motion 實現流暢動畫
- ✅ **響應式設計**：適配各種螢幕尺寸
- ✅ **背景輪播**：Hero 區塊背景圖片自動輪播
- ✅ **本地存儲**：語言偏好自動保存到 localStorage

## 📁 文件結構

```
src/
├── lib/
│   └── i18n.ts                    # i18n 配置文件
├── components/
│   └── PBLSKnowledgeBase.tsx      # 主要 React 組件
└── main.tsx                       # React 入口文件

react-pbls-demo.html              # 演示頁面
REACT_I18N_README.md              # 說明文件
```

## 🛠️ 安裝與運行

### 1. 安裝依賴

```bash
npm install
```

### 2. 運行開發服務器

```bash
npm run dev
```

### 3. 查看演示

- 開啟 `react-pbls-demo.html` 查看靜態演示
- 或運行開發服務器後訪問 React 組件

## 📋 組件功能詳解

### 1. 國際化配置 (`src/lib/i18n.ts`)

- 支援中文 (`zh`) 和英文 (`en`) 兩種語言
- 包含 Hero 區塊、流程圖、情境案例、按鈕等所有文字
- 自動檢測瀏覽器語言偏好
- 語言設定保存到 localStorage

### 2. 主要組件 (`src/components/PBLSKnowledgeBase.tsx`)

#### Hero 區塊
- 背景圖片輪播（場景1-4）
- 動態翻譯標題和描述
- 平滑滾動到流程圖區塊

#### 流程圖區塊
- 根據語言切換圖片路徑
- 中文：`/PBLS流程圖.png`
- 英文：`/PBLS_Flowchart_EN.png`

#### 情境模擬區塊
- 五大情境卡片：心臟驟停、食物中毒、溺水、火災嗆傷、外傷
- 圖片根據語言切換：`assets/{情境}情境.png` 或 `assets/{情境}情境_EN.png`
- 響應式網格布局

#### 語言切換按鈕
- 右上角浮動按鈕
- 點擊切換中文/英文
- 懸停動畫效果

### 3. 翻譯鍵值對應

| 功能區塊 | 中文鍵值 | 英文鍵值 |
|---------|---------|---------|
| Hero 標題 | `hero.title` | `hero.title` |
| Hero 描述 | `hero.description` | `hero.description` |
| 流程圖標題 | `flowchart.title` | `flowchart.title` |
| 情境標題 | `scenarios.{情境}.title` | `scenarios.{情境}.title` |
| 情境描述 | `scenarios.{情境}.description` | `scenarios.{情境}.description` |
| 按鈕文字 | `buttons.{按鈕名}` | `buttons.{按鈕名}` |

## 🎨 樣式特色

- **漸變背景**：Hero 區塊使用動態背景圖片
- **卡片設計**：情境卡片使用白色背景 + 陰影
- **動畫效果**：Framer Motion 提供流暢的懸停和點擊動畫
- **響應式布局**：使用 CSS Grid 適配不同螢幕尺寸
- **字體**：Microsoft JhengHei 中文字體 + Segoe UI 英文字體

## 🔧 自定義配置

### 添加新語言

1. 在 `src/lib/i18n.ts` 的 `resources` 中添加新語言
2. 複製現有翻譯並修改為對應語言
3. 更新 `fallbackLng` 設定

### 添加新翻譯內容

1. 在對應語言的 `translation` 對象中添加新的鍵值對
2. 在組件中使用 `t('new.key')` 讀取翻譯

### 添加新圖片

1. 按照命名規則添加圖片文件
2. 在組件中更新 `getScenarioImage` 或 `getFlowchartImage` 函數

## 📱 響應式設計

- **桌面端**：完整布局，5列情境卡片
- **平板端**：3-4列情境卡片
- **手機端**：單列布局，優化觸控體驗

## 🌐 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 授權

此組件基於現有的 PBLS 教學平台開發，遵循相同的授權條款。

---

**注意**：這是一個演示組件，實際部署時請確保所有圖片資源路徑正確，並根據需要調整翻譯內容。
