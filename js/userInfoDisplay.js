/**
 * 統一用戶資訊顯示服務
 * 在所有頁面顯示統一的用戶資訊格式
 */
import { getUnifiedUID } from './unifiedAuthService.js';

class UserInfoDisplay {
  constructor() {
    this.userData = null;
    this.isInitialized = false;
  }

  /**
   * 初始化用戶資訊顯示
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // 從 localStorage 獲取用戶資料
      const localUserData = localStorage.getItem('pbls_user');
      if (localUserData) {
        this.userData = JSON.parse(localUserData);
        this.isInitialized = true;
        console.log('✅ 用戶資訊顯示服務已初始化');
      } else {
        console.warn('⚠️ 未找到用戶資料');
      }
    } catch (error) {
      console.error('❌ 初始化用戶資訊顯示失敗:', error);
    }
  }

  /**
   * 獲取格式化的用戶資訊顯示文字
   */
  getDisplayText() {
    if (!this.userData) {
      return '載入中...';
    }

    const name = this.userData.name || this.userData.displayName || '未命名使用者';
    const school = this.userData.where || this.userData['school/hospital'] || '未設置';
    const department = this.userData.department || '未設置';
    
    // 使用多行顯示：姓名在左側，學校和部門在下方
    return `${name}\n${school} | ${department}`;
  }

  /**
   * 獲取簡化的用戶資訊（一行顯示）
   */
  getSimpleDisplayText() {
    if (!this.userData) {
      return '載入中...';
    }

    const name = this.userData.name || this.userData.displayName || '未命名使用者';
    const school = this.userData.where || this.userData['school/hospital'] || '未設置';
    
    return `${name} (${school})`;
  }

  /**
   * 獲取完整的用戶資料（用於彈出視窗）
   */
  getFullUserData() {
    if (!this.userData) {
      return null;
    }

    return {
      // 基本資訊
      name: this.userData.name || this.userData.displayName || '未命名使用者',
      account: this.userData.account || '未設置',
      
      // 學校/醫院資訊
      school: this.userData.where || this.userData['school/hospital'] || '未設置',
      department: this.userData.department || '未設置',
      studentId: this.userData.studentId || '未設置',
      
      // 聯絡資訊
      phone: this.userData.phone || '未設置',
      
      // 統計資訊
      totalTests: this.userData.totalTests || 0,
      totalTimeSpent: this.userData.totalTimeSpent || 0,
      
      // 時間資訊
      loginTime: this.userData.loginTime || '未設置',
      createdAt: this.userData.createdAt || '未設置',
      
      // 狀態
      isActive: this.userData.isActive !== undefined ? this.userData.isActive : true
    };
  }

  /**
   * 更新用戶資訊顯示
   */
  async updateDisplay() {
    await this.initialize();
    
    const userInfoDisplay = document.getElementById('user-info-display');
    if (userInfoDisplay) {
      userInfoDisplay.textContent = this.getDisplayText();
      // 設置樣式以支援多行顯示
      userInfoDisplay.style.whiteSpace = 'pre-line';
      userInfoDisplay.style.lineHeight = '1.4';
      userInfoDisplay.style.fontSize = '14px';
    }
  }

  /**
   * 顯示用戶資料彈出視窗
   */
  showUserProfile() {
    const userData = this.getFullUserData();
    if (!userData) {
      alert('無法載入用戶資料');
      return;
    }

    // 創建彈出視窗
    this.createProfileModal(userData);
  }

  /**
   * 創建用戶資料彈出視窗
   */
  createProfileModal(userData) {
    // 移除現有的彈出視窗
    const existingModal = document.getElementById('user-profile-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // 創建模態框
    const modal = document.createElement('div');
    modal.id = 'user-profile-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeUserProfile()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="fas fa-user-circle"></i> 用戶資料</h3>
            <button class="modal-close" onclick="closeUserProfile()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="user-profile-section">
              <h4><i class="fas fa-user"></i> 基本資訊</h4>
              <div class="profile-item">
                <span class="label">姓名:</span>
                <span class="value">${userData.name}</span>
              </div>
              <div class="profile-item">
                <span class="label">帳號:</span>
                <span class="value">${userData.account}</span>
              </div>
            </div>
            
            <div class="user-profile-section">
              <h4><i class="fas fa-building"></i> 機構資訊</h4>
              <div class="profile-item">
                <span class="label">學校/醫院:</span>
                <span class="value">${userData.school}</span>
              </div>
              <div class="profile-item">
                <span class="label">部門:</span>
                <span class="value">${userData.department}</span>
              </div>
              <div class="profile-item">
                <span class="label">學號/工號:</span>
                <span class="value">${userData.studentId}</span>
              </div>
            </div>
            
            <div class="user-profile-section">
              <h4><i class="fas fa-phone"></i> 聯絡資訊</h4>
              <div class="profile-item">
                <span class="label">電話:</span>
                <span class="value">${userData.phone}</span>
              </div>
            </div>
            
            <div class="user-profile-section">
              <h4><i class="fas fa-chart-bar"></i> 學習統計</h4>
              <div class="profile-item">
                <span class="label">總測驗次數:</span>
                <span class="value">${userData.totalTests} 次</span>
              </div>
              <div class="profile-item">
                <span class="label">總學習時間:</span>
                <span class="value">${Math.floor(userData.totalTimeSpent / 60)} 分鐘</span>
              </div>
            </div>
            
            <div class="user-profile-section">
              <h4><i class="fas fa-clock"></i> 時間資訊</h4>
              <div class="profile-item">
                <span class="label">本次登入:</span>
                <span class="value">${new Date(userData.loginTime).toLocaleString()}</span>
              </div>
              <div class="profile-item">
                <span class="label">帳號建立:</span>
                <span class="value">${userData.createdAt ? new Date(userData.createdAt).toLocaleString() : '未設置'}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `;

    // 添加樣式
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
      }
      
      .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px;
        border-bottom: 1px solid #eee;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 15px 15px 0 0;
      }
      
      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      
      .modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: background 0.2s;
      }
      
      .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .modal-body {
        padding: 25px;
      }
      
      .user-profile-section {
        margin-bottom: 25px;
      }
      
      .user-profile-section h4 {
        color: #667eea;
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 8px;
      }
      
      .profile-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f8f8f8;
      }
      
      .profile-item:last-child {
        border-bottom: none;
      }
      
      .profile-item .label {
        font-weight: 600;
        color: #555;
        min-width: 120px;
      }
      
      .profile-item .value {
        color: #333;
        text-align: right;
        flex: 1;
        word-break: break-all;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }
}

// 創建全域實例
export const userInfoDisplay = new UserInfoDisplay();

// 全域函數
window.showUserProfile = () => userInfoDisplay.showUserProfile();
window.closeUserProfile = () => {
  const modal = document.getElementById('user-profile-modal');
  if (modal) modal.remove();
};

// 暴露到全域以便除錯
window.__UserInfoDisplay__ = userInfoDisplay;
