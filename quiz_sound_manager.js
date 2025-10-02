/**
 * 答題音效管理系統
 * 管理答題系統中的所有音效播放
 */
class QuizSoundManager {
    constructor() {
        this.sounds = {};
        this.currentSound = null;
        this.isInitialized = false;
        this.volume = 0.7; // 預設音量
    }

    /**
     * 初始化音效系統
     */
    async init() {
        try {
            console.log('🎵 開始初始化音效系統...');
            
            // 載入所有音效檔案
            this.sounds = {
                countdown: new Audio('quiz_sound/答題倒數.mp3'),
                question: new Audio('quiz_sound/答題音效.mp4'),
                correct: new Audio('quiz_sound/回答正確.mp3'),
                wrong: new Audio('quiz_sound/回答錯誤.mp3')
            };

            // 設置音效屬性並添加事件監聽器
            Object.keys(this.sounds).forEach(key => {
                const sound = this.sounds[key];
                sound.preload = 'auto';
                sound.volume = this.volume;
                
                // 添加載入事件監聽器
                sound.addEventListener('canplaythrough', () => {
                    console.log(`✅ ${key} 音效載入成功`);
                });
                
                sound.addEventListener('error', (e) => {
                    console.error(`❌ ${key} 音效載入失敗:`, e);
                });
                
                sound.addEventListener('loadstart', () => {
                    console.log(`🔄 開始載入 ${key} 音效...`);
                });
            });

            this.isInitialized = true;
            console.log('🎵 答題音效系統初始化成功');
        } catch (error) {
            console.error('❌ 音效系統初始化失敗:', error);
            this.isInitialized = false;
        }
    }

    /**
     * 停止當前播放的音效
     */
    stopCurrentSound() {
        if (this.currentSound) {
            this.currentSound.pause();
            this.currentSound.currentTime = 0;
            this.currentSound = null;
        }
    }

    /**
     * 停止所有音效
     */
    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.currentSound = null;
    }

    /**
     * 播放答題倒數音效
     */
    playCountdown() {
        if (!this.isInitialized) return;
        
        console.log('🎵 播放答題倒數音效');
        this.stopAllSounds();
        
        this.currentSound = this.sounds.countdown;
        this.currentSound.volume = this.volume * 0.3; // 倒數音效音量降低70%
        this.currentSound.play().catch(error => {
            console.error('播放倒數音效失敗:', error);
        });
    }

    /**
     * 播放答題音效
     */
    playQuestion() {
        if (!this.isInitialized) {
            console.error('❌ 音效系統未初始化');
            return;
        }
        
        console.log('🎵 播放答題音效');
        this.stopAllSounds();
        
        this.currentSound = this.sounds.question;
        this.currentSound.loop = true; // 循環播放
        this.currentSound.volume = 1.0; // 答題音效最大音量
        
        console.log(`🎵 答題音效設定: 音量=${this.currentSound.volume}, 循環=${this.currentSound.loop}`);
        
        // 添加播放事件監聽器
        this.currentSound.addEventListener('play', () => {
            console.log('✅ 答題音效開始播放');
        });
        
        this.currentSound.addEventListener('error', (e) => {
            console.error('❌ 答題音效播放錯誤:', e);
        });
        
        this.currentSound.play().then(() => {
            console.log('✅ 答題音效播放成功');
        }).catch(error => {
            console.error('❌ 播放答題音效失敗:', error);
        });
    }

    /**
     * 播放正確音效
     */
    playCorrect() {
        if (!this.isInitialized) return;
        
        console.log('🎵 播放正確音效');
        this.stopAllSounds();
        
        this.currentSound = this.sounds.correct;
        this.currentSound.volume = this.volume * 0.7; // 正確音效音量降低30%
        this.currentSound.play().catch(error => {
            console.error('播放正確音效失敗:', error);
        });
    }

    /**
     * 播放錯誤音效
     */
    playWrong() {
        if (!this.isInitialized) return;
        
        console.log('🎵 播放錯誤音效');
        this.stopAllSounds();
        
        this.currentSound = this.sounds.wrong;
        this.currentSound.volume = this.volume * 0.7; // 錯誤音效音量降低30%
        this.currentSound.play().catch(error => {
            console.error('播放錯誤音效失敗:', error);
        });
    }

    /**
     * 設置音量
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }

    /**
     * 獲取當前音量
     */
    getVolume() {
        return this.volume;
    }
}

// 創建全域音效管理器實例
window.quizSoundManager = new QuizSoundManager();
