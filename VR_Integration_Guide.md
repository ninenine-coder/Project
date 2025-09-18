# 🥽 VR功能整合指南

## 📋 預留功能清單

### ✅ 已預留的功能區域

1. **360度實境教學影片區域**
   - 位置：中央影片播放區域
   - 預留標記：`vr-integration-notice`
   - 容器：`.video-container`

2. **虛擬人功能區域**
   - 位置：用戶頭像區域
   - 預留標記：`avatar-placeholder`
   - 容器：`.user-avatar`

3. **VR控制功能**
   - 位置：影片區域下方
   - 預留標記：`.vr-controls`

## 🔧 整合準備

### 檔案結構
```
Project/
├── index-with-placeholders.html    # 預留版本（當前使用）
├── index.html                      # 完整版本（整合後使用）
├── vr-assets/                      # VR相關資源（待建立）
│   ├── unity-build/               # Unity WebGL Build
│   ├── 360-videos/                # 360度影片檔案
│   └── avatar-models/             # 虛擬人模型
└── VR_Integration_Guide.md        # 本指南
```

## 🎯 整合步驟

### 步驟1: 360度影片整合

#### 1.1 替換影片區域
```html
<!-- 替換 .vr-placeholder 區域 -->
<div class="vr-video-player">
    <iframe 
        src="vr-assets/360-videos/player.html"
        width="100%" 
        height="100%"
        frameborder="0">
    </iframe>
</div>
```

#### 1.2 添加360度影片播放器
```javascript
// 在 script 區域添加
function init360VideoPlayer() {
    // 360度影片播放邏輯
    const videoPlayer = new AFrame360Player({
        container: '.video-container',
        videoSrc: 'vr-assets/360-videos/pbls-training.mp4'
    });
}
```

### 步驟2: Unity WebGL整合

#### 2.1 添加Unity Build檔案
```html
<!-- 在 head 區域添加 -->
<script src="vr-assets/unity-build/Build/UnityLoader.js"></script>
```

#### 2.2 初始化Unity場景
```javascript
// Unity WebGL 整合
function initUnityVR() {
    const gameInstance = UnityLoader.instantiate(
        "unity-container", 
        "vr-assets/unity-build/Build/pbls-vr.json", 
        {
            onProgress: UnityProgress,
            Module: {
                onRuntimeInitialized: function() {
                    console.log("Unity VR場景載入完成");
                }
            }
        }
    );
}
```

### 步驟3: 虛擬人功能整合

#### 3.1 替換用戶頭像
```html
<!-- 替換 .user-avatar 區域 -->
<div class="user-avatar" id="userAvatar">
    <div class="avatar-3d-container">
        <canvas id="avatar-canvas"></canvas>
    </div>
    <div class="avatar-placeholder" style="display: none;">AI</div>
</div>
```

#### 3.2 添加虛擬人控制
```javascript
// 虛擬人功能
function initVirtualAvatar() {
    const avatar = new VirtualAvatar({
        container: '#avatar-canvas',
        modelPath: 'vr-assets/avatar-models/pbls-avatar.glb',
        aiEndpoint: 'https://api.pbls-ai.com/chat'
    });
    
    avatar.onMessage = function(message) {
        // 處理AI回應
        showAvatarMessage(message);
    };
}
```

## 📁 需要準備的檔案

### Unity WebGL Build
```
vr-assets/unity-build/
├── Build/
│   ├── UnityLoader.js
│   ├── pbls-vr.json
│   ├── pbls-vr.wasm
│   └── pbls-vr.data
└── TemplateData/
    └── style.css
```

### 360度影片
```
vr-assets/360-videos/
├── pbls-training.mp4
├── pbls-scenario1.mp4
├── pbls-scenario2.mp4
└── player.html
```

### 虛擬人模型
```
vr-assets/avatar-models/
├── pbls-avatar.glb
├── pbls-avatar.fbx
└── textures/
    ├── avatar-texture.jpg
    └── avatar-normal.jpg
```

## 🔗 整合標記說明

### HTML標記
```html
<!-- VR功能預留區域 -->
<div class="vr-placeholder">
    <!-- 這裡將被360度影片播放器替換 -->
</div>

<!-- 虛擬人功能預留標記 -->
<div class="avatar-placeholder" title="虛擬人功能預留區域">AI</div>

<!-- VR功能整合提示 -->
<div class="vr-integration-notice">
    VR功能預留區域
</div>
```

### CSS類別
```css
/* VR功能預留樣式 */
.vr-placeholder { /* 360度影片容器 */ }
.avatar-placeholder { /* 虛擬人標記 */ }
.vr-integration-notice { /* 整合提示 */ }
.vr-controls { /* VR控制按鈕 */ }
```

### JavaScript函數
```javascript
// 預留的整合函數
function showVRIntegrationInfo() { /* 顯示整合說明 */ }
function init360VideoPlayer() { /* 初始化360度影片 */ }
function initUnityVR() { /* 初始化Unity VR */ }
function initVirtualAvatar() { /* 初始化虛擬人 */ }
```

## 🚀 整合流程

### 階段1: 準備資源
1. 準備Unity WebGL Build檔案
2. 準備360度影片檔案
3. 準備虛擬人模型檔案

### 階段2: 替換預留區域
1. 替換 `.vr-placeholder` 為實際的360度影片播放器
2. 替換 `.avatar-placeholder` 為虛擬人3D模型
3. 移除 `.vr-integration-notice` 提示

### 階段3: 添加功能邏輯
1. 添加360度影片播放邏輯
2. 添加Unity VR場景控制
3. 添加虛擬人AI對話功能

### 階段4: 測試整合
1. 測試360度影片播放
2. 測試VR頭盔支援
3. 測試虛擬人互動

## 📝 整合檢查清單

### 360度影片整合
- [ ] 影片檔案已準備
- [ ] 播放器已整合
- [ ] 控制功能正常
- [ ] 響應式設計正常

### Unity WebGL整合
- [ ] Build檔案已準備
- [ ] UnityLoader已載入
- [ ] 場景初始化正常
- [ ] VR功能正常

### 虛擬人整合
- [ ] 3D模型已準備
- [ ] AI對話功能正常
- [ ] 語音識別正常
- [ ] 互動功能正常

## 🔧 技術需求

### 前端技術
- WebXR API支援
- Three.js 3D渲染
- A-Frame VR框架
- Unity WebGL

### 後端技術
- AI對話API
- 語音識別服務
- 影片串流服務
- 用戶資料管理

## 📞 整合支援

### 常見問題
1. **Unity Build載入失敗**
   - 檢查檔案路徑
   - 確認MIME類型設定
   - 檢查瀏覽器相容性

2. **360度影片無法播放**
   - 檢查影片格式
   - 確認播放器設定
   - 檢查網路連線

3. **虛擬人模型無法顯示**
   - 檢查3D模型格式
   - 確認WebGL支援
   - 檢查材質貼圖

### 技術支援
- 參考Unity WebGL文檔
- 參考WebXR API文檔
- 參考Three.js文檔

## 🎯 整合完成後

### 檔案更新
1. 將 `index-with-placeholders.html` 重新命名為 `index.html`
2. 更新GitHub Pages部署
3. 測試所有功能

### 功能驗證
1. 登入系統正常
2. 360度影片播放正常
3. VR頭盔支援正常
4. 虛擬人互動正常
5. 響應式設計正常

**準備好開始整合VR功能了嗎？按照這個指南逐步進行整合！** 🚀
