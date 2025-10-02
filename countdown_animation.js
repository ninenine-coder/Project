/**
 * 倒數動畫系統
 * 純JavaScript版本，整合到答題系統中
 */
class CountdownAnimation {
    constructor() {
        this.container = null;
        this.currentIndex = 0;
        this.sequence = ["3", "2", "1", "開始"];
        this.isAnimating = false;
        this.onComplete = null;
    }

    /**
     * 創建倒數動畫容器
     */
    createContainer() {
        // 找到測驗容器
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) {
            console.error('找不到測驗容器');
            return;
        }

        // 創建倒數動畫容器（覆蓋測驗容器）
        this.container = document.createElement('div');
        this.container.id = 'countdown-animation';
        this.container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            font-family: 'Microsoft JhengHei', sans-serif;
            pointer-events: none;
            text-align: center;
        `;

        // 創建倒數數字容器
        this.numberContainer = document.createElement('div');
        this.numberContainer.style.cssText = `
            position: relative;
            text-align: center;
            user-select: none;
            background: none;
            background-color: transparent;
            border: none;
            outline: none;
            padding: 0;
            margin: 0;
            box-shadow: none;
            width: auto;
            height: auto;
            min-width: 0;
            min-height: 0;
            max-width: none;
            max-height: none;
            overflow: visible;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: horizontal-tb;
            text-orientation: mixed;
            white-space: nowrap;
        `;

        this.container.appendChild(this.numberContainer);
        quizContainer.appendChild(this.container);
    }

    /**
     * 顯示倒數數字
     */
    showNumber(number, isFinal = false) {
        // 清除之前的內容
        this.numberContainer.innerHTML = '';

        // 創建數字元素
        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.style.cssText = `
            font-size: ${isFinal ? '8rem' : '10rem'};
            font-weight: 900;
            letter-spacing: 0.1em;
            color: #2c3e50;
            line-height: 1;
            background: none;
            background-color: transparent;
            border: none;
            outline: none;
            text-shadow: 
                2px 2px 12px rgba(0,0,0,0.25), 
                0 0 20px rgba(0,0,0,0.15),
                0 4px 10px rgba(0,0,0,0.35);
            -webkit-text-stroke: 2px rgba(0,0,0,0.15);
            transform: scale(0.6);
            opacity: 0;
            filter: blur(8px);
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 0;
            margin: 0;
            box-shadow: none;
            width: auto;
            height: auto;
            min-width: 0;
            min-height: 0;
            max-width: none;
            max-height: none;
            overflow: visible;
            position: static;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: ${isFinal ? 'horizontal-tb' : 'horizontal-tb'};
            text-orientation: mixed;
            white-space: nowrap;
            text-align: center;
        `;

        this.numberContainer.appendChild(numberElement);

        // 觸發動畫
        requestAnimationFrame(() => {
            numberElement.style.transform = 'scale(1.0)';
            numberElement.style.opacity = '1';
            numberElement.style.filter = 'blur(0px)';
        });
    }

    /**
     * 隱藏數字
     */
    hideNumber() {
        const numberElement = this.numberContainer.querySelector('div');
        if (numberElement) {
            numberElement.style.transform = 'scale(1.15)';
            numberElement.style.opacity = '0';
            numberElement.style.filter = 'blur(6px)';
        }
    }

    /**
     * 開始倒數動畫
     */
    start(onComplete) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.onComplete = onComplete;
        this.currentIndex = 0;
        
        this.createContainer();
        this.showNextNumber();
    }

    /**
     * 顯示下一個數字
     */
    showNextNumber() {
        if (this.currentIndex >= this.sequence.length) {
            this.complete();
            return;
        }

        const number = this.sequence[this.currentIndex];
        const isFinal = number === "開始";
        
        this.showNumber(number, isFinal);

        // 設置下一個數字的延遲
        const duration = isFinal ? 1100 : 900;
        
        setTimeout(() => {
            if (this.currentIndex < this.sequence.length - 1) {
                this.hideNumber();
                setTimeout(() => {
                    this.currentIndex++;
                    this.showNextNumber();
                }, 100);
            } else {
                // 最後一個數字
                setTimeout(() => {
                    this.complete();
                }, 300);
            }
        }, duration);
    }

    /**
     * 完成倒數動畫
     */
    complete() {
        this.hideNumber();
        
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            
            this.isAnimating = false;
            if (this.onComplete) {
                this.onComplete();
            }
        }, 300);
    }

    /**
     * 停止倒數動畫
     */
    stop() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isAnimating = false;
    }
}

// 創建全域倒數動畫實例
window.countdownAnimation = new CountdownAnimation();
