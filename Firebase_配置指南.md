# Firebase Realtime Database 配置指南

## 🎯 功能說明

您的PBLS VR教學平台現在已經集成了Firebase Realtime Database功能，實現以下特性：

### ✨ 已實現功能
- **即時觀看數統計** - 每次點擊播放按鈕，觀看數+1並即時推播到所有用戶
- **即時按讚功能** - 點擊愛心按鈕，按讚數+1並即時推播到所有用戶
- **單一影片設計** - 長方形影片卡片，包含標題、描述、統計數據
- **視覺反饋** - 播放通知、按讚動畫、懸停效果

## 🔧 Firebase 配置步驟

### 1. 創建Firebase專案
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」
3. 輸入專案名稱：`pbls-vr-platform`
4. 啟用Google Analytics（可選）

### 2. 啟用Realtime Database
1. 在Firebase Console中，點擊「Realtime Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式啟動」（稍後可調整安全規則）
4. 選擇資料庫位置（建議選擇asia-southeast1）

### 3. 獲取配置資訊
1. 點擊專案設定（齒輪圖示）
2. 滾動到「您的應用程式」區段
3. 點擊「新增應用程式」→「Web應用程式」
4. 輸入應用程式暱稱：`pbls-web-app`
5. 複製配置物件

### 4. 更新index.html配置
將以下代碼中的配置替換為您的實際配置：

```javascript
const firebaseConfig = {
    apiKey: "您的API金鑰",
    authDomain: "您的專案.firebaseapp.com",
    projectId: "您的專案ID",
    storageBucket: "您的專案.appspot.com",
    messagingSenderId: "您的發送者ID",
    appId: "您的應用程式ID",
    databaseURL: "https://您的專案-default-rtdb.firebaseio.com/"
};
```

### 5. 啟用Firebase功能
在index.html中，取消註釋以下代碼：

```javascript
// 取消註釋這兩行
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
```

### 6. 啟用即時更新功能
取消註釋以下代碼以啟用即時數據同步：

```javascript
// 在initVideoStats()函數中
database.ref('videoStats').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        videoStats = data;
        updateVideoStatsDisplay();
    }
});

// 在loadVideoStats()函數中
database.ref('videoStats').once('value').then((snapshot) => {
    const data = snapshot.val();
    if (data) {
        videoStats = data;
    } else {
        videoStats = { views: 0, likes: 0 };
        database.ref('videoStats').set(videoStats);
    }
    updateVideoStatsDisplay();
});

// 在updateFirebaseStats()函數中
database.ref(`videoStats/${field}`).set(value);
```

## 📊 數據庫結構

Firebase Realtime Database將使用以下結構：

```json
{
  "videoStats": {
    "views": 1234,
    "likes": 89
  }
}
```

## 🔒 安全規則設定

在Firebase Console的Realtime Database → 規則中，設定以下安全規則：

```json
{
  "rules": {
    "videoStats": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 🎮 使用方式

### 播放影片
1. 點擊影片縮圖上的播放按鈕
2. 觀看數自動+1
3. 所有用戶的觀看數即時更新
4. 顯示播放通知

### 按讚功能
1. 點擊愛心圖示
2. 按讚數+1，圖示變為紅色實心
3. 再次點擊可取消按讚
4. 所有用戶的按讚數即時更新

## 🚀 測試功能

1. 開啟多個瀏覽器視窗
2. 在一個視窗中點擊播放或按讚
3. 觀察其他視窗中的數字即時更新

## 📝 注意事項

- 確保Firebase專案已正確配置
- 檢查網路連線
- 確認瀏覽器支援Firebase SDK
- 測試時使用不同的瀏覽器或無痕模式

## 🛠️ 故障排除

### 常見問題
1. **數據不更新** - 檢查Firebase配置是否正確
2. **權限錯誤** - 確認安全規則設定
3. **網路錯誤** - 檢查網路連線和防火牆設定

### 除錯方法
1. 開啟瀏覽器開發者工具
2. 查看Console是否有錯誤訊息
3. 檢查Network標籤中的Firebase請求

---

**配置完成後，您的PBLS VR教學平台將擁有完整的即時數據同步功能！** 🎉
