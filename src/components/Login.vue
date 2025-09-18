<template>
  <div class="login-container">
    <div class="login-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <h1>PBLS</h1>
          </div>
          <p class="subtitle">VR教學平台</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">電子郵件</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              placeholder="請輸入您的電子郵件"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">密碼</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="請輸入您的密碼"
              required
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            :disabled="loading"
          >
            <span v-if="loading" class="loading"></span>
            <span v-else>登入</span>
          </button>
        </form>

        <div class="divider">
          <span>或</span>
        </div>

        <button 
          @click="handleGoogleLogin" 
          class="btn btn-google"
          :disabled="loading"
        >
          <i class="fab fa-google"></i>
          使用 Google 登入
        </button>

        <div class="login-footer">
          <p>還沒有帳號？ <a href="#" @click.prevent="showSignUp = true">立即註冊</a></p>
        </div>
      </div>

      <!-- 註冊表單 -->
      <div v-if="showSignUp" class="signup-overlay" @click="showSignUp = false">
        <div class="signup-card" @click.stop>
          <div class="signup-header">
            <h2>註冊新帳號</h2>
            <button @click="showSignUp = false" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="handleSignUp" class="signup-form">
            <div class="form-group">
              <label for="signup-email">電子郵件</label>
              <input
                type="email"
                id="signup-email"
                v-model="signupEmail"
                class="form-control"
                placeholder="請輸入電子郵件"
                required
              />
            </div>

            <div class="form-group">
              <label for="signup-password">密碼</label>
              <input
                type="password"
                id="signup-password"
                v-model="signupPassword"
                class="form-control"
                placeholder="請輸入密碼（至少6位數）"
                required
                minlength="6"
              />
            </div>

            <div class="form-group">
              <label for="confirm-password">確認密碼</label>
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                class="form-control"
                placeholder="請再次輸入密碼"
                required
              />
            </div>

            <div v-if="signupErrorMessage" class="error-message">
              {{ signupErrorMessage }}
            </div>

            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading || signupPassword !== confirmPassword"
            >
              <span v-if="loading" class="loading"></span>
              <span v-else>註冊</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      email: '',
      password: '',
      signupEmail: '',
      signupPassword: '',
      confirmPassword: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
      signupErrorMessage: '',
      showSignUp: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''

      const result = await signInWithEmail(this.email, this.password)
      
      if (result.success) {
        this.successMessage = '登入成功！正在跳轉...'
        setTimeout(() => {
          this.router.push('/dashboard')
        }, 1000)
      } else {
        this.errorMessage = this.getErrorMessage(result.error)
      }
      
      this.loading = false
    },

    async handleGoogleLogin() {
      this.loading = true
      this.errorMessage = ''

      const result = await signInWithGoogle()
      
      if (result.success) {
        this.successMessage = '登入成功！正在跳轉...'
        setTimeout(() => {
          this.router.push('/dashboard')
        }, 1000)
      } else {
        this.errorMessage = this.getErrorMessage(result.error)
      }
      
      this.loading = false
    },

    async handleSignUp() {
      if (this.signupPassword !== this.confirmPassword) {
        this.signupErrorMessage = '密碼確認不一致'
        return
      }

      this.loading = true
      this.signupErrorMessage = ''

      const result = await signUpWithEmail(this.signupEmail, this.signupPassword)
      
      if (result.success) {
        this.showSignUp = false
        this.successMessage = '註冊成功！請使用新帳號登入'
        this.email = this.signupEmail
        this.signupEmail = ''
        this.signupPassword = ''
        this.confirmPassword = ''
      } else {
        this.signupErrorMessage = this.getErrorMessage(result.error)
      }
      
      this.loading = false
    },

    getErrorMessage(error) {
      const errorMessages = {
        'auth/user-not-found': '找不到此電子郵件對應的帳號',
        'auth/wrong-password': '密碼錯誤',
        'auth/invalid-email': '電子郵件格式不正確',
        'auth/user-disabled': '此帳號已被停用',
        'auth/too-many-requests': '嘗試次數過多，請稍後再試',
        'auth/email-already-in-use': '此電子郵件已被使用',
        'auth/weak-password': '密碼強度不足',
        'auth/operation-not-allowed': '此操作不被允許'
      }
      return errorMessages[error] || '登入失敗，請檢查您的資訊'
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.logo i {
  font-size: 2.5rem;
  color: #667eea;
}

.logo h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  margin-top: 10px;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 15px;
  color: #666;
  font-size: 14px;
}

.btn-google {
  width: 100%;
  padding: 15px;
  background: #fff;
  color: #333;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
}

.btn-google:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.btn-google i {
  font-size: 1.2rem;
  color: #4285f4;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

.signup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.signup-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.signup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.signup-header h2 {
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.close-btn:hover {
  color: #333;
}

.signup-form .btn {
  width: 100%;
  margin-top: 10px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .logo h1 {
    font-size: 2rem;
  }
  
  .logo i {
    font-size: 2rem;
  }
}
</style>
