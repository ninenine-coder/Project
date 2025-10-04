/**
 * 考試結束時儲存成績的示例
 * 在您的考試頁面中引入並使用此功能
 */

import { saveExamResultToFirestore } from './js/results.js';

/**
 * 考試結束時儲存成績
 * @param {Object} examData - 考試數據
 */
export async function saveExamResult(examData) {
    try {
        // 獲取當前用戶
        const me = JSON.parse(localStorage.getItem('pbls_user') || 'null');
        if (!me || !me.uid) {
            throw new Error('請先登入');
        }

        // 準備成績數據
        const resultData = {
            uid: me.uid,
            examId: examData.examId || 'PBLS-Exam-2025',
            examTitle: examData.examTitle || 'PBLS 急救測驗',
            scoreRaw: examData.scoreRaw || 0,
            scorePct: examData.scorePct || 0,
            totalQuestions: examData.totalQuestions || 0,
            correctCount: examData.correctCount || 0,
            durationSec: examData.durationSec || 0,
            answers: examData.answers || []
        };

        console.log('準備儲存成績:', resultData);

        // 儲存到 Firestore
        const result = await saveExamResultToFirestore(resultData);
        
        console.log('✅ 成績已儲存，嘗試 ID:', result.attemptId);
        
        // 可以選擇跳轉到成績詳情頁面
        // window.location.href = `web/result.html?attemptId=${result.attemptId}`;
        
        return result;
        
    } catch (error) {
        console.error('❌ 儲存成績失敗:', error);
        throw error;
    }
}

/**
 * 示例：在考試結束時調用
 */
export function onExamComplete(examResults) {
    // 計算成績
    const totalQuestions = examResults.questions.length;
    const correctCount = examResults.questions.filter(q => q.isCorrect).length;
    const scorePct = correctCount / totalQuestions;
    const scoreRaw = Math.round(scorePct * 100);
    
    // 準備答案數據
    const answers = examResults.questions.map((q, index) => ({
        qid: `Q${index + 1}`,
        selected: q.selectedAnswer,
        correct: q.correctAnswer,
        isCorrect: q.isCorrect,
        timeSec: q.timeSpent || null
    }));
    
    // 儲存成績
    saveExamResult({
        examId: 'PBLS-Exam-2025',
        examTitle: 'PBLS 急救測驗',
        scoreRaw: scoreRaw,
        scorePct: scorePct,
        totalQuestions: totalQuestions,
        correctCount: correctCount,
        durationSec: examResults.totalTime || 0,
        answers: answers
    }).then(result => {
        alert(`考試完成！成績已儲存。\n\n分數：${scoreRaw}分\n答對：${correctCount}/${totalQuestions}題`);
        
        // 可選擇跳轉到成績詳情
        if (confirm('是否查看成績詳情？')) {
            window.location.href = `web/result.html?attemptId=${result.attemptId}`;
        }
    }).catch(error => {
        alert('儲存成績失敗：' + error.message);
    });
}
