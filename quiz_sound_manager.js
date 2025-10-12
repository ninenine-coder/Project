/**
 * 答題音效管理系統 - 簡潔版本
 * 管理答題系統中的所有音效播放
 */
class QuizSoundManager {
    constructor() {
        this.sounds = {};
        this.currentSound = null;
        this.isInitialized = false;
        this.volume = 0.7;
    }

    /**
     * 初始化音效系統
     */
    async init() {
        try {
            console.log('🎵 初始化音效系統...');
            
            this.sounds = {
                countdown: new Audio('./quiz_sound/答題倒數.mp3'),
                question: new Audio('./quiz_sound/答題音效.mp4'),
                correct: new Audio('./quiz_sound/回答正確.mp3'),
                wrong: new Audio('./quiz_sound/回答錯誤.mp3')
            };

            Object.keys(this.sounds).forEach(key => {
                const sound = this.sounds[key];
                sound.preload = 'auto';
                sound.volume = this.volume;
                
                sound.addEventListener('canplaythrough', () => {
                    console.log(`✅ ${key} 音效載入成功`);
                });
                
                sound.addEventListener('error', (e) => {
                    console.error(`❌ ${key} 音效載入失敗:`, e);
                });
            });

            this.isInitialized = true;
            console.log('✅ 音效系統初始化完成');
            
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
        
        this.stopAllSounds();
        this.currentSound = this.sounds.countdown;
        this.currentSound.volume = this.volume * 0.3;
        this.currentSound.currentTime = 0;
        
        this.currentSound.play().catch(error => {
            console.error('❌ 播放倒數音效失敗:', error);
        });
    }

    /**
     * 播放答題音效
     */
    playQuestion() {
        if (!this.isInitialized) return;
        
        this.stopAllSounds();
        this.currentSound = this.sounds.question;
        this.currentSound.loop = true;
        this.currentSound.volume = 1.0;
        
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
        
        this.stopAllSounds();
        this.currentSound = this.sounds.correct;
        this.currentSound.volume = this.volume * 0.7;
        this.currentSound.currentTime = 0;
        
        this.currentSound.play().catch(error => {
            console.error('❌ 播放正確音效失敗:', error);
        });
    }

    /**
     * 播放錯誤音效
     */
    playWrong() {
        if (!this.isInitialized) return;
        
        this.stopAllSounds();
        this.currentSound = this.sounds.wrong;
        this.currentSound.volume = this.volume * 0.7;
        this.currentSound.currentTime = 0;
        
        this.currentSound.play().catch(error => {
            console.error('❌ 播放錯誤音效失敗:', error);
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