#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Firebase環境變數設置工具\n');

// 檢查是否已存在.env文件
const envPath = path.join(process.cwd(), '.env');
const templatePath = path.join(process.cwd(), 'env.template');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env 文件已存在');
  rl.question('是否要覆蓋現有的 .env 文件？ (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('❌ 設置已取消');
      rl.close();
    }
  });
} else {
  setupEnvironment();
}

function setupEnvironment() {
  console.log('\n📋 請提供您的Firebase配置信息：\n');

  const questions = [
    {
      key: 'VITE_FIREBASE_API_KEY',
      question: 'Firebase API Key: ',
      required: true
    },
    {
      key: 'VITE_FIREBASE_AUTH_DOMAIN',
      question: 'Firebase Auth Domain (格式: your-project.firebaseapp.com): ',
      required: true
    },
    {
      key: 'VITE_FIREBASE_PROJECT_ID',
      question: 'Firebase Project ID: ',
      required: true
    },
    {
      key: 'VITE_FIREBASE_STORAGE_BUCKET',
      question: 'Firebase Storage Bucket (格式: your-project.appspot.com): ',
      required: true
    },
    {
      key: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
      question: 'Firebase Messaging Sender ID: ',
      required: true
    },
    {
      key: 'VITE_FIREBASE_APP_ID',
      question: 'Firebase App ID: ',
      required: true
    },
    {
      key: 'VITE_FIREBASE_MEASUREMENT_ID',
      question: 'Firebase Measurement ID (可選，按Enter跳過): ',
      required: false
    }
  ];

  const envVars = {};

  function askQuestion(index) {
    if (index >= questions.length) {
      createEnvFile(envVars);
      return;
    }

    const q = questions[index];
    rl.question(q.question, (answer) => {
      if (q.required && !answer.trim()) {
        console.log('❌ 此字段為必填項，請重新輸入');
        askQuestion(index);
      } else {
        envVars[q.key] = answer.trim();
        askQuestion(index + 1);
      }
    });
  }

  askQuestion(0);
}

function createEnvFile(envVars) {
  console.log('\n📝 創建 .env 文件...');

  const envContent = `# Firebase Configuration
# 自動生成於 ${new Date().toISOString()}

${Object.entries(envVars)
  .filter(([key, value]) => value)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n')}

# 注意事項：
# 1. 不要將此文件提交到版本控制系統（Git）
# 2. 所有變數前綴必須是 VITE_ 才能被Vite讀取
# 3. 請從Firebase控制台的專案設定中獲取這些值
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env 文件創建成功！');
    
    // 檢查.gitignore
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        console.log('⚠️  建議在 .gitignore 文件中添加 .env 以避免提交敏感信息');
      } else {
        console.log('✅ .env 已在 .gitignore 中，安全！');
      }
    } else {
      console.log('⚠️  建議創建 .gitignore 文件並添加 .env');
    }

    console.log('\n🎉 設置完成！現在可以運行以下命令：');
    console.log('   npm run dev    # 啟動開發服務器');
    console.log('   npm run build  # 建置專案');
    
  } catch (error) {
    console.error('❌ 創建 .env 文件失敗:', error.message);
  }

  rl.close();
}

// 處理中斷信號
rl.on('SIGINT', () => {
  console.log('\n❌ 設置已取消');
  rl.close();
});
