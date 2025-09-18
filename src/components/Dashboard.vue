<template>
  <div class="dashboard">
    <!-- 頂部跑馬燈區域 -->
    <div class="marquee-section">
      <div class="marquee-content">
        <div class="marquee-item">
          <i class="fas fa-info-circle"></i>
          <span>網站新資訊</span>
        </div>
        <div class="marquee-item">
          <i class="fas fa-book"></i>
          <span>PBLS知識</span>
        </div>
        <div class="marquee-item">
          <i class="fas fa-arrow-right"></i>
          <span>下一頁</span>
        </div>
      </div>
      <div class="pbls-logo">
        <span>PBLS</span>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 左側選單區域 -->
      <div class="sidebar">
        <div class="menu-icons">
          <div 
            v-for="(menu, index) in menus" 
            :key="index"
            class="menu-icon"
            :class="{ active: activeMenu === index }"
            @mouseenter="showMenu(index)"
            @mouseleave="hideMenu"
            @click="selectMenu(index)"
          >
            <i :class="menu.icon"></i>
            <div class="menu-tooltip">{{ menu.name }}</div>
          </div>
        </div>
        <div class="menu-description">
          <p>4個選單</p>
          <p>將滑鼠移到圖示上方 會向右彈開</p>
          <p>練習題 顯示中文字 點選後 會自動下移到該區段</p>
        </div>
      </div>

      <!-- 中央影片區域 -->
      <div class="video-section">
        <div class="video-container">
          <div class="video-placeholder">
            <i class="fas fa-vr-cardboard"></i>
            <h3>360實境教學影片</h3>
            <p>請連接VR頭盔...</p>
            <div class="vr-controls">
              <button class="btn btn-primary">
                <i class="fas fa-play"></i>
                開始播放
              </button>
              <button class="btn btn-secondary">
                <i class="fas fa-cog"></i>
                設定
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側用戶區域 -->
      <div class="user-section">
        <div class="user-profile">
          <div class="user-avatar" @click="toggleUserMenu">
            <img :src="userAvatar" :alt="userName" />
            <div class="avatar-overlay">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          <div class="user-info">
            <h4>{{ userName }}</h4>
            <p>點擊頭像跳出</p>
          </div>
        </div>

        <!-- 用戶選單 -->
        <div class="user-menu" :class="{ show: showUserMenu }">
          <div class="menu-item" @click="goToAccount">
            <i class="fas fa-user-cog"></i>
            <span>帳戶資訊</span>
          </div>
          <div class="menu-item" @click="toggleLanguage">
            <i class="fas fa-language"></i>
            <span>中英文轉換</span>
          </div>
          <div class="menu-item" @click="goToHistory">
            <i class="fas fa-history"></i>
            <span>資料庫</span>
          </div>
          <div class="menu-item" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>登出</span>
          </div>
          <div class="menu-item" @click="goToRecords">
            <i class="fas fa-search"></i>
            <span>查詢紀錄</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部幫助區域 -->
    <div class="help-section">
      <div class="help-content">
        <div class="help-icon">
          <i class="fas fa-question-circle"></i>
        </div>
        <div class="help-text">
          <h4>導入使用手冊</h4>
          <p>虛擬人說明</p>
        </div>
        <div class="sport-options">
          <div class="sport-item">
            <i class="fas fa-swimming-pool"></i>
            <span>游泳</span>
          </div>
          <div class="sport-item">
            <i class="fas fa-volleyball-ball"></i>
            <span>排球</span>
          </div>
        </div>
        <div class="arrow-indicator">
          <i class="fas fa-arrow-right"></i>
          <span>做液晶玻璃</span>
        </div>
      </div>
    </div>

    <!-- 展開的選單內容 -->
    <div class="expanded-menu" :class="{ show: expandedMenu !== null }">
      <div v-if="expandedMenu !== null" class="menu-content">
        <h3>{{ menus[expandedMenu].name }}</h3>
        <div class="menu-items">
          <div 
            v-for="(item, index) in menus[expandedMenu].items" 
            :key="index"
            class="menu-item"
            @click="selectMenuItem(expandedMenu, index)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from '../firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      activeMenu: null,
      expandedMenu: null,
      showUserMenu: false,
      userName: '用戶名稱',
      userAvatar: 'https://via.placeholder.com/60x60/667eea/ffffff?text=U',
      menus: [
        {
          name: '對話練習',
          icon: 'fas fa-comments',
          items: [
            { name: '基礎對話', icon: 'fas fa-comment' },
            { name: '情境對話', icon: 'fas fa-comments' },
            { name: '專業術語', icon: 'fas fa-graduation-cap' }
          ]
        },
        {
          name: '聽力訓練',
          icon: 'fas fa-volume-up',
          items: [
            { name: '基礎聽力', icon: 'fas fa-headphones' },
            { name: '進階聽力', icon: 'fas fa-volume-up' },
            { name: '專業聽力', icon: 'fas fa-microphone' }
          ]
        },
        {
          name: '閱讀練習',
          icon: 'fas fa-book',
          items: [
            { name: '基礎閱讀', icon: 'fas fa-book-open' },
            { name: '文章閱讀', icon: 'fas fa-file-alt' },
            { name: '專業閱讀', icon: 'fas fa-scroll' }
          ]
        },
        {
          name: '數據分析',
          icon: 'fas fa-chart-bar',
          items: [
            { name: '學習進度', icon: 'fas fa-chart-line' },
            { name: '成績統計', icon: 'fas fa-chart-pie' },
            { name: '能力分析', icon: 'fas fa-chart-bar' }
          ]
        }
      ]
    }
  },
  methods: {
    showMenu(index) {
      this.expandedMenu = index
    },
    hideMenu() {
      // 延遲隱藏，讓用戶有時間點擊
      setTimeout(() => {
        this.expandedMenu = null
      }, 200)
    },
    selectMenu(index) {
      this.activeMenu = index
      this.expandedMenu = index
    },
    selectMenuItem(menuIndex, itemIndex) {
      const menu = this.menus[menuIndex]
      const item = menu.items[itemIndex]
      console.log(`選擇了 ${menu.name} - ${item.name}`)
      // 這裡可以添加跳轉到對應區段的邏輯
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    goToAccount() {
      console.log('前往帳戶資訊')
      this.showUserMenu = false
    },
    toggleLanguage() {
      console.log('切換語言')
      this.showUserMenu = false
    },
    goToHistory() {
      console.log('前往歷史記錄')
      this.showUserMenu = false
    },
    goToRecords() {
      console.log('查詢紀錄')
      this.showUserMenu = false
    },
    async logout() {
      try {
        await logout()
        this.router.push('/login')
      } catch (error) {
        console.error('登出失敗:', error)
      }
    }
  },
  mounted() {
    // 點擊外部關閉選單
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-section')) {
        this.showUserMenu = false
      }
      if (!e.target.closest('.sidebar')) {
        this.expandedMenu = null
      }
    })
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
}

.marquee-section {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.marquee-content {
  display: flex;
  gap: 30px;
  align-items: center;
}

.marquee-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.marquee-item i {
  font-size: 16px;
}

.pbls-logo {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

.main-content {
  flex: 1;
  display: flex;
  padding: 30px;
  gap: 30px;
}

.sidebar {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-icons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.menu-icon:hover,
.menu-icon.active {
  transform: translateX(10px);
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.menu-icon i {
  font-size: 24px;
}

.menu-tooltip {
  position: absolute;
  left: 70px;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.menu-icon:hover .menu-tooltip {
  opacity: 1;
  transform: translateX(0);
}

.menu-description {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  line-height: 1.6;
  color: #666;
}

.video-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-container {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 40px;
}

.video-placeholder i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #667eea;
}

.video-placeholder h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.video-placeholder p {
  color: #ccc;
  margin-bottom: 30px;
}

.vr-controls {
  display: flex;
  gap: 15px;
}

.user-section {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.user-profile {
  text-align: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  cursor: pointer;
  position: relative;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-avatar:hover .avatar-overlay {
  opacity: 1;
}

.user-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.user-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.user-menu {
  position: absolute;
  top: 120px;
  right: 0;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 15px 0;
  min-width: 200px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 100;
}

.user-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.user-menu .menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.user-menu .menu-item:hover {
  background: #f8f9fa;
}

.user-menu .menu-item i {
  width: 20px;
  color: #667eea;
}

.help-section {
  background: white;
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 20px;
}

.help-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.help-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.help-text h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.help-text p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.sport-options {
  display: flex;
  gap: 15px;
}

.sport-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sport-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.sport-item i {
  font-size: 1.5rem;
  color: #667eea;
}

.sport-item span {
  font-size: 12px;
  color: #666;
}

.arrow-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #667eea;
  font-weight: 500;
}

.expanded-menu {
  position: fixed;
  left: 250px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 20px;
  min-width: 250px;
  opacity: 0;
  transform: translateY(-50%) translateX(-20px);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 50;
}

.expanded-menu.show {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
  pointer-events: all;
}

.menu-content h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2rem;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-items .menu-item {
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-items .menu-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.menu-items .menu-item i {
  color: #667eea;
  width: 20px;
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .menu-icons {
    flex-direction: row;
  }
  
  .user-section {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .expanded-menu {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .marquee-section {
    padding: 10px 20px;
    flex-direction: column;
    gap: 10px;
  }
  
  .marquee-content {
    gap: 15px;
  }
  
  .help-section {
    padding: 15px 20px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .help-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
