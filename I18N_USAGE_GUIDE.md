# i18n 語言切換系統使用指南

## 概述

本系統已升級為使用 i18next 的完整國際化解決方案，解決了之前語言切換時沒有全部資訊都切換的問題。

## 主要特性

### ✅ 完整語言切換
- **所有頁面內容**：包括標題、選單、按鈕、描述文字等
- **動態內容**：測驗題目、結果頁面、歷史記錄等
- **用戶界面**：跑馬燈、模態框、提示訊息等

### ✅ 語言偏好保存
- **localStorage 持久化**：用戶的語言選擇會自動保存
- **跨頁面一致性**：切換頁面後語言設置保持不變
- **瀏覽器重啟記憶**：重新打開瀏覽器後語言設置依然有效

### ✅ 智能初始化
- **自動檢測**：根據瀏覽器語言或已保存的偏好自動設置
- **回退機制**：如果檢測失敗，使用預設語言（繁體中文）
- **異步載入**：不阻塞頁面載入，提升用戶體驗

## 文件結構

```
src/js/
├── i18n-config.js              # i18next 配置和翻譯資源
├── enhanced-language-manager.js # 增強的語言管理器
└── legacy-compatibility.js     # 舊版兼容性支持

locales/
├── zh-TW/
│   └── translation.json        # 繁體中文翻譯
└── en/
    └── translation.json        # 英文翻譯
```

## 使用方法

### 1. 基本語言切換

```javascript
// 切換到指定語言
window.enhancedLanguageManager.toggleLanguage();

// 或者使用全局函數
toggleLanguage();
```

### 2. 獲取翻譯文本

```javascript
// 獲取翻譯文本
const title = window.enhancedLanguageManager.getTranslation('common.header.title');
const menuItems = window.enhancedLanguageManager.getTranslation('common.menu.info');
```

### 3. 監聽語言變更事件

```javascript
window.addEventListener('languageChanged', function(event) {
    console.log('語言已變更到:', event.detail.language);
    // 執行自定義邏輯
});
```

## 翻譯鍵值結構

### 通用內容 (common)
```json
{
  "common": {
    "pageTitle": {
      "info": "資訊 - PBLS VR教學平台",
      "practice": "練習專區 - PBLS VR教學平台",
      "exam": "考試專區 - PBLS VR教學平台",
      "history": "歷史成績 - PBLS VR教學平台",
      "team": "團隊 - PBLS VR教學平台",
      "quiz": "筆試測驗 - PBLS VR教學平台"
    },
    "header": {
      "title": "歡迎使用PBLS教學平台",
      "userInfo": "長庚大學, 資管系"
    },
    "menu": {
      "info": "資訊",
      "practice": "練習專區",
      "exam": "考試專區",
      "history": "歷史成績",
      "team": "團隊"
    }
  }
}
```

### 頁面特定內容
- `info.*` - 資訊頁面內容
- `practice.*` - 練習專區內容
- `quiz.*` - 測驗相關內容
- `history.*` - 歷史成績內容
- `team.*` - 團隊頁面內容

## HTML 整合

### 1. 添加 i18next 腳本
```html
<!-- i18next -->
<script src="https://unpkg.com/i18next@23.7.6/i18next.min.js"></script>
<script src="https://unpkg.com/i18next-browser-languagedetector@7.2.0/i18nextBrowserLanguageDetector.min.js"></script>
```

### 2. 載入語言管理器
```html
<!-- 載入增強的語言管理器 -->
<script type="module">
    import './src/js/enhanced-language-manager.js';
</script>
```

### 3. 使用 data-i18n 屬性（可選）
```html
<h1 data-i18n="common.header.title">歡迎使用PBLS教學平台</h1>
<p data-i18n="common.header.userInfo">長庚大學, 資管系</p>
```

## 兼容性

### 舊版語言切換器支持
系統提供了完整的向後兼容性：

```javascript
// 舊的函數仍然可以工作
window.toggleLanguage();
window.languageSwitcher.toggleLanguage();
window.languageSwitcher.applyLanguage('en');
```

### 自動重定向
舊的語言切換器方法會自動重定向到新的增強管理器，確保無縫升級。

## 測試

### 測試頁面
打開 `test-i18n-language-switching.html` 來測試語言切換功能：

1. **基本翻譯測試** - 驗證所有翻譯鍵值是否正確顯示
2. **語言切換測試** - 測試切換按鈕和自動切換功能
3. **持久化測試** - 驗證語言設置是否正確保存
4. **跨頁面測試** - 在不同頁面間切換，確認語言一致性

### 調試信息
測試頁面提供實時調試信息，包括：
- 當前語言設置
- 系統初始化狀態
- localStorage 內容
- i18next 狀態

## 故障排除

### 常見問題

1. **語言切換不生效**
   - 檢查瀏覽器控制台是否有錯誤
   - 確認 i18next 腳本已正確載入
   - 驗證翻譯文件是否存在

2. **翻譯文本顯示為鍵值**
   - 檢查翻譯鍵值是否正確
   - 確認對應語言的翻譯文件包含該鍵值
   - 驗證 i18next 是否已初始化

3. **語言設置不保存**
   - 檢查瀏覽器是否支持 localStorage
   - 確認沒有其他腳本清除 localStorage
   - 驗證語言檢測配置是否正確

### 調試步驟

1. 打開瀏覽器開發者工具
2. 檢查 Console 標籤頁的錯誤訊息
3. 在 Application 標籤頁檢查 localStorage 內容
4. 使用測試頁面驗證功能

## 擴展指南

### 添加新語言

1. 在 `locales/` 目錄下創建新的語言文件夾
2. 複製現有翻譯文件並翻譯內容
3. 在 `i18n-config.js` 中添加新語言資源
4. 更新語言檢測配置

### 添加新翻譯鍵值

1. 在 `locales/zh-TW/translation.json` 中添加中文翻譯
2. 在 `locales/en/translation.json` 中添加英文翻譯
3. 在 `enhanced-language-manager.js` 中添加對應的更新邏輯

### 自定義語言切換邏輯

```javascript
// 在 enhanced-language-manager.js 中擴展
updateCustomPage() {
    // 添加自定義頁面的語言切換邏輯
    const customElement = document.querySelector('.custom-element');
    if (customElement) {
        customElement.textContent = this.getTranslation('custom.key');
    }
}
```

## 性能優化

- **異步載入**：語言管理器異步初始化，不阻塞頁面載入
- **智能更新**：只更新必要的 DOM 元素，避免不必要的重繪
- **緩存機制**：翻譯文本緩存在內存中，提升切換速度
- **事件驅動**：使用事件系統通知其他組件語言變更

## 更新日誌

### v2.0.0 (當前版本)
- ✅ 完整重寫為 i18next 系統
- ✅ 解決語言切換不完整的問題
- ✅ 添加語言偏好持久化
- ✅ 提供完整的向後兼容性
- ✅ 添加測試頁面和調試工具

### v1.0.0 (舊版本)
- 基本的語言切換功能
- 手動管理的翻譯系統
- 部分內容無法切換的問題
