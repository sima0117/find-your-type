document.addEventListener('DOMContentLoaded', function() {
    let diagnosisData;
    let config;

    // どの診断のデータが読み込まれているかを判定
    if (typeof studentQuestions !== 'undefined') {
        diagnosisData = studentQuestions;
        config = {
            typePrefix: 'st',
            axes: [['A', 'C'], ['I', 'L'], ['M', 'R'], ['T', 'S']]
        };
    } else if (typeof teacherQuestions !== 'undefined') {
        // ▼▼▼ この部分を完成させました ▼▼▼
        diagnosisData = teacherQuestions;
        config = {
            typePrefix: 'tt',
            axes: [['O', 'A'], ['P', 'L'], ['C', 'D'], ['G', 'I']]
        };
        // ▲▲▲ ここまで ▲▲▲
    } else if (typeof gamerQuestions !== 'undefined') {
        diagnosisData = gamerQuestions;
        config = {
            typePrefix: 'gt',
            axes: [['A', 'E'], ['D', 'R'], ['T', 'I'], ['C', 'S']]
        };
    }

    // 診断データが見つからない場合はここで処理を終了
    if (!diagnosisData) {
        console.error("診断の質問データが見つかりません。");
        return;
    }

    const form = document.getElementById('quiz-form');
    if (!form) return;

    // --- 1. 質問フォームを動的に生成 ---
    let questionsHtml = '';
    const totalQuestions = diagnosisData.sliderQuestions.length + diagnosisData.decisiveQuestions.length;

    // スライダー質問の生成
    diagnosisData.sliderQuestions.forEach((q, index) => {
        const qNum = index + 1;
        questionsHtml += `
            <div class="question-block">
                <p class="question-number">質問 ${qNum}/${totalQuestions}</p>
                <p class="question-text">${q.question}</p>
                <div class="slider-container">
                    <span class="slider-label">同意しない</span>
                    <input type="range" name="q_slider_${qNum}" min="0" max="10" step="1" value="5" class="slider">
                    <span class="slider-label">同意する</span>
                </div>
            </div>
        `;
    });

    // 決定問（選択式）の生成
    diagnosisData.decisiveQuestions.forEach((q, index) => {
        const qNum = diagnosisData.sliderQuestions.length + index + 1;
        questionsHtml += `
            <div class="question-block decisive-question">
                <p class="question-number">質問 ${qNum}/${totalQuestions}</p>
                <p class="question-text">${q.question}</p>
                <div class="decisive-options">
                    <label>
                        <input type="radio" name="q_decisive_${index}" value="${q.options.A.type}" required>
                        <span>${q.options.A.text}</span>
                    </label>
                    <label>
                        <input type="radio" name="q_decisive_${index}" value="${q.options.B.type}" required>
                        <span>${q.options.B.text}</span>
                    </label>
                </div>
            </div>
        `;
    });

    form.innerHTML = questionsHtml + '<button type="submit" class="button-link">診断結果を見る</button>';

    // --- 2. フォーム送信時の処理 ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // エラーチェック
        const sliderValues = [];
        for (let i = 1; i <= diagnosisData.sliderQuestions.length; i++) {
            sliderValues.push(formData.get(`q_slider_${i}`));
        }
        const uniqueSliderValues = new Set(sliderValues);
        if (uniqueSliderValues.size === 1) {
            window.location.href = `${config.typePrefix}_error.html`;
            return;
        }

        // --- 3. スコア計算 ---
        let scores = {};
        config.axes.flat().forEach(letter => scores[letter] = 0); 

        // スライダー質問のスコア計算 (×3)
        diagnosisData.sliderQuestions.forEach((q, index) => {
            const qNum = index + 1;
            const value = formData.get(`q_slider_${qNum}`);
            scores[q.type] += parseInt(value, 10) * 3;
        });

        // 決定問のスコア計算 (+10)
        diagnosisData.decisiveQuestions.forEach((q, index) => {
            const chosenType = formData.get(`q_decisive_${index}`);
            if (chosenType) {
                scores[chosenType] += 10;
            }
        });
        
        // --- 4. タイプ判定 ---
        let finalType = '';
        config.axes.forEach(pair => {
            const type1 = pair[0];
            const type2 = pair[1];
            finalType += scores[type1] >= scores[type2] ? type1 : type2;
        });
        
        // --- 5. 結果ページへ遷移 ---
        triggerVibration(50);
        setTimeout(() => {
            window.location.href = `${config.typePrefix}_type/${finalType}.html`; 
        }, 100);
    });
});