document.addEventListener('DOMContentLoaded', () => {
    // 質問項目
    const questions = [
        // Q1は固定
        { text: "あなたは25歳ですか？", answer: "yes" },
        // Q2以降
        { text: "サブスクを使っていますか？", answer: "neutral" },
        { text: "ワイヤレスイヤホンを使っていますか？", answer: "no" },
        { text: "音楽はサブスクで聞いていますか？", answer: "no" },
        { text: "クラウドサービスは使っていますか？", answer: "no" },
        { text: "Google マップのタイムライン機能はオフになっていますか？", answer: "yes" },
        { text: "黒いワイシャツ（カッターシャツ）を持っていますか？", answer: "yes" },
        { text: "LINEのアイコンは初期設定のままですか？", answer: "yes" },
        { text: "イタリア　マイヅルゥーニャ地方出身ですか？", answer: "yes" },
        { text: "スマホはiPhoneですか？", answer: "no" },
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
        // Q2以降をシャッフル
        const questionsToShuffle = questions.slice(1);
        for (let i = questionsToShuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questionsToShuffle[i], questionsToShuffle[j]] = [questionsToShuffle[j], questionsToShuffle[i]];
        }

        // Q1とシャッフルしたQ2以降を結合
        currentQuestions = [questions[0], ...questionsToShuffle];
        
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
        if (score >= 80) {
            resultMessageEl.textContent = "驚異のTAKUYA度！あなたはTAKUYA本人かもしれません。";
        } else if (score >= 50) {
            resultMessageEl.textContent = "かなりのTAKUYA度ですね。親近感を覚えます。";
        } else if (score >= 20) {
            resultMessageEl.textContent = "あなたの中にもTAKUYAが眠っているようです。";
        } else {
            resultMessageEl.textContent = "まだTAKUYA度は低いようです。これからの成長に期待！";
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