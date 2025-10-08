document.addEventListener('DOMContentLoaded', () => {
    // 質問項目をグループ化
    const questionGroups = [
        // Q1 (固定)
        [{ text: "あなたは25歳ですか？", answer: "yes" }],
        // Q2 (ランダム)
        [
            { text: "いつも赤いスニーカーを履いている。", answer: "yes" },
            { text: "いつも黒いスニーカーを履いている。", answer: "no" }
        ],
        // Q3 (ランダム)
        [
            { text: "スマホはXperiaですか？", answer: "yes" },
            { text: "スマホはiPhoneですか？", answer: "no" }
        ],
        // Q4 (ランダム)
        [
            { text: "埼玉県和光市に住んでいたことがある？", answer: "neutral" },
            { text: "東京都２３区に住んでいたことがある？", answer: "neutral" }
        ],
        // Q5 (ランダム)
        [
            { text: "ワイヤレスイヤホンを使っていますか？", answer: "no" },
            { text: "黒いワイシャツ（カッターシャツ）を持っていますか？", answer: "yes" }
        ],
        // Q6 (ランダム)
        [
            { text: "イタリア　マイヅルゥーニャ地方出身ですか？", answer: "yes" },
            { text: "最終学歴は東◯大学卒業だ。", answer: "yes" }
        ],
        // Q7 (ランダム)
        [
            { text: "音楽はサブスクで聴いていますか？", answer: "no" },
            { text: "音楽はウォークマンで聴いていますか？", answer: "yes" }
        ],
        // Q8 (ランダム)
        [
            { text: "LINEのアイコンは初期設定のままですか？", answer: "yes" },
            { text: "Google マップのタイムライン機能はオフになっていますか？", answer: "yes" }
        ],
        // Q9 (ランダム)
        [
            { text: "サブスクを使っていますか？", answer: "neutral" },
            { text: "クラウドサービスは使っていますか？", answer: "no" }
        ],
        // Q10 (固定)
        [{ text: "あなたはかっこいいですか？", answer: "yes" }]
    ];

    const quizForm = document.getElementById('quiz-form');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const takuyaScoreEl = document.getElementById('takuya-score');
    const resultMessageEl = document.getElementById('result-message');
    const retryButton = document.getElementById('retry-button');
    
    let currentQuestions = [];

    // 質問をセットアップする関数
    function setupQuiz() {
        currentQuestions = [];
        // 各グループからランダムに1問選ぶ
        questionGroups.forEach(group => {
            const randomIndex = Math.floor(Math.random() * group.length);
            currentQuestions.push(group[randomIndex]);
        });
        
        // HTMLを生成
        let quizHtml = '';
        currentQuestions.forEach((q, index) => {
            quizHtml += `
                <div class="question-block">
                    <p class="question-text">Q${index + 1}. ${q.text}</p>
                    <div class="options">
                        <label>
                            <input type="radio" name="q${index}" value="yes" required>
                            <span>はい</span>
                        </label>
                        <label>
                            <input type="radio" name="q${index}" value="neutral" required>
                            <span>どちらともいえない</span>
                        </label>
                        <label>
                            <input type="radio" name="q${index}" value="no" required>
                            <span>いいえ</span>
                        </label>
                    </div>
                </div>
            `;
        });
        
        quizForm.innerHTML = quizHtml + '<button type="submit" id="submit-button">結果を見る</button>';
    }

    // フォーム送信時の処理
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(quizForm);
        let score = 0;

        currentQuestions.forEach((q, index) => {
            const userAnswer = formData.get(`q${index}`);
            const correctAnswer = q.answer;

            if (userAnswer === correctAnswer) {
                score += 10;
            } else if (correctAnswer === 'yes' || correctAnswer === 'no') {
                if (userAnswer === 'neutral') {
                    score += 5;
                }
            }
        });

        // 結果を表示
        takuyaScoreEl.textContent = score;
        
        if (score === 100) {
            resultMessageEl.textContent = "パーフェクト！あなたはTAKUYAです。";
        } else if (score >= 80) {
            resultMessageEl.textContent = "驚異のTAKUYA！あなたはTAKUYA本人かもしれません。";
        } else if (score >= 50) {
            resultMessageEl.textContent = "かなりのTAKUYAですね。親近感を覚えます。";
        } else if (score >= 30) {
            resultMessageEl.textContent = "あなたの中にもTAKUYAが眠っているようです。";
        } else if (score >= 11) {
            resultMessageEl.textContent = "まだまだTAKUYAは低いようです。これからの成長に期待！";
        } else {
            resultMessageEl.textContent = "あなたはTAKUYAではありません。";
        }
        
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    });

    // 「もう一度」ボタンの処理
    retryButton.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        setupQuiz();
    });

    // 初期化
    setupQuiz();
});