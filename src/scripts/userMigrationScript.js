/**
 * 用戶數據遷移腳本
 * 用於一次性升級舊帳戶，添加缺少的字段
 */

import UserFieldManager from '../services/userFieldManager.js';

class UserMigrationScript {
    constructor() {
        this.fieldManager = new UserFieldManager();
        this.migrationLog = [];
    }

    /**
     * 執行完整的用戶數據遷移
     * @returns {Promise<Object>} 遷移結果
     */
    async executeMigration() {
        console.log('🚀 開始執行用戶數據遷移...');
        
        try {
            // 初始化字段管理器
            await this.fieldManager.initialize();
            
            // 獲取遷移前的統計信息
            const beforeStats = await this.fieldManager.getFieldStatistics();
            this.log('遷移前統計', beforeStats);
            
            // 執行批量遷移
            const migrationResults = await this.fieldManager.migrateAllUsers();
            this.log('遷移結果', migrationResults);
            
            // 獲取遷移後的統計信息
            const afterStats = await this.fieldManager.getFieldStatistics();
            this.log('遷移後統計', afterStats);
            
            // 生成遷移報告
            const report = this.generateMigrationReport(beforeStats, afterStats, migrationResults);
            
            console.log('✅ 用戶數據遷移完成');
            console.log('📊 遷移報告:', report);
            
            return {
                success: true,
                report,
                migrationLog: this.migrationLog
            };
            
        } catch (error) {
            console.error('❌ 用戶數據遷移失敗:', error);
            this.log('遷移錯誤', error.message);
            
            return {
                success: false,
                error: error.message,
                migrationLog: this.migrationLog
            };
        }
    }

    /**
     * 檢查單個用戶的遷移需求
     * @param {string} userId - 用戶ID
     * @returns {Promise<Object>} 檢查結果
     */
    async checkUserMigration(userId) {
        try {
            await this.fieldManager.initialize();
            const migrationInfo = await this.fieldManager.checkMigrationNeeded(userId);
            
            this.log(`檢查用戶 ${userId}`, migrationInfo);
            return migrationInfo;
            
        } catch (error) {
            console.error(`檢查用戶 ${userId} 失敗:`, error);
            return {
                needsMigration: false,
                error: error.message
            };
        }
    }

    /**
     * 遷移單個用戶
     * @param {string} userId - 用戶ID
     * @returns {Promise<Object>} 遷移結果
     */
    async migrateSingleUser(userId) {
        try {
            await this.fieldManager.initialize();
            
            // 檢查遷移需求
            const migrationInfo = await this.checkUserMigration(userId);
            
            if (!migrationInfo.needsMigration) {
                return {
                    success: true,
                    message: '用戶無需遷移',
                    migrationInfo
                };
            }
            
            // 執行遷移
            const success = await this.fieldManager.migrateUserDocument(userId);
            
            if (success) {
                this.log(`遷移用戶 ${userId}`, '成功');
                return {
                    success: true,
                    message: '用戶遷移成功',
                    migrationInfo
                };
            } else {
                this.log(`遷移用戶 ${userId}`, '失敗');
                return {
                    success: false,
                    message: '用戶遷移失敗',
                    migrationInfo
                };
            }
            
        } catch (error) {
            console.error(`遷移用戶 ${userId} 失敗:`, error);
            this.log(`遷移用戶 ${userId}`, error.message);
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 生成遷移報告
     * @param {Object} beforeStats - 遷移前統計
     * @param {Object} afterStats - 遷移後統計
     * @param {Object} migrationResults - 遷移結果
     * @returns {Object} 遷移報告
     */
    generateMigrationReport(beforeStats, afterStats, migrationResults) {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalUsers: migrationResults.total,
                migratedUsers: migrationResults.migrated,
                failedUsers: migrationResults.failed,
                successRate: migrationResults.total > 0 ? 
                    Math.round((migrationResults.migrated / migrationResults.total) * 100) : 0
            },
            fieldImprovements: {},
            errors: migrationResults.errors || []
        };

        // 計算字段改善情況
        if (beforeStats && afterStats) {
            Object.keys(beforeStats.fieldStats).forEach(fieldName => {
                const before = beforeStats.fieldStats[fieldName];
                const after = afterStats.fieldStats[fieldName];
                
                report.fieldImprovements[fieldName] = {
                    beforePercentage: before.percentage,
                    afterPercentage: after.percentage,
                    improvement: after.percentage - before.percentage,
                    beforeCount: before.present,
                    afterCount: after.present,
                    addedCount: after.present - before.present
                };
            });
        }

        return report;
    }

    /**
     * 記錄遷移日誌
     * @param {string} action - 操作描述
     * @param {any} data - 數據
     */
    log(action, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action,
            data
        };
        
        this.migrationLog.push(logEntry);
        console.log(`[${logEntry.timestamp}] ${action}:`, data);
    }

    /**
     * 獲取遷移日誌
     * @returns {Array} 遷移日誌
     */
    getMigrationLog() {
        return this.migrationLog;
    }

    /**
     * 清除遷移日誌
     */
    clearMigrationLog() {
        this.migrationLog = [];
    }

    /**
     * 導出遷移報告為 JSON
     * @param {Object} report - 遷移報告
     * @returns {string} JSON 字符串
     */
    exportReportAsJSON(report) {
        return JSON.stringify(report, null, 2);
    }

    /**
     * 導出遷移報告為 CSV
     * @param {Object} report - 遷移報告
     * @returns {string} CSV 字符串
     */
    exportReportAsCSV(report) {
        const headers = ['字段名', '遷移前百分比', '遷移後百分比', '改善幅度', '遷移前數量', '遷移後數量', '新增數量'];
        const rows = [headers.join(',')];

        Object.keys(report.fieldImprovements).forEach(fieldName => {
            const improvement = report.fieldImprovements[fieldName];
            const row = [
                fieldName,
                improvement.beforePercentage,
                improvement.afterPercentage,
                improvement.improvement,
                improvement.beforeCount,
                improvement.afterCount,
                improvement.addedCount
            ];
            rows.push(row.join(','));
        });

        return rows.join('\n');
    }
}

// 創建全局實例
window.userMigrationScript = new UserMigrationScript();

// 導出類
export default UserMigrationScript;
