document.addEventListener("DOMContentLoaded", function() {
    // 生徒用の質問リスト（全24問）
    const questions = [
        // 学びの源泉 (A⇔C)
        "テストやスポーツなど、何事においても一番になることに強い喜びを感じる。",
        "すぐに何の役に立つか分からない知識でも、知ること自体が面白いと感じる。",
        "将来の目標を達成するために、勉強や部活動などを努力することは苦ではない。",
        "教科書に載っていることだけでなく、関連する全く違う分野のことにもつい興味が湧いてしまう。",
        "「精神的に向上心のないものは、馬鹿だ」という言葉に、強く共感する。",
        "「私は特別な才能があるわけではない。ただ情熱的に好奇心を抱いているだけだ」という言葉に、強く共感する。",
        // 思考のスタイル (I⇔L)
        "難しい問題を解決するには、様々な角度から眺めているうちに、ある瞬間に答えの全体像がふと頭に浮かんでくることがある。",
        "難しい問題を解決するには、まず情報を整理し手順通りに一つずつ検討していくのが一番確実な方法だ。",
        "発表をするときや人と話すとき、データや事実を並べるよりも、人の心を動かすストーリーや印象的なエピソードを重視する。",
        "発表をするときや人と話すとき、感動的なエピソードよりも、主張を裏付ける客観的なデータや根拠を重視する。",
        "買い物をする時、スペックを細かく比較するよりも、「これだ！」という直感や、デザインの第一印象を信じて決めることが多い。",
        "買い物をする時、衝動買いはせず、複数の製品のスペックや価格を客観的に比較・分析して決める。",
        // 先生との関係 (M⇔R)
        "分からないことがあったら、すぐに先生に質問しに行って、直接教えてもらうのが一番良い。",
        "分からないことがあっても、まずは自分で調べたり考えたりして、どうしても無理な時だけ先生に質問しに行く。",
        "休み時間や放課後、先生と勉強以外の雑談をするのは好きだ。",
        "先生とは、あくまで勉強や学校生活に必要なことだけを話し、プライベートな話はあまりしたくない。",
        "何か個人的な問題で悩んだ時、まずは信頼できる人に相談して、アドバイスを求める。",
        "何か個人的な問題で悩んだ時、すぐに誰かに相談するのではなく、まずは自分一人でじっくりと考え、結論を出したい。",
        // 他者との連携 (T⇔S)
        "一人で勉強するよりも、友達と教え合ったり、問題を出し合ったりしながら学ぶ方が好きだ。",
        "勉強は、自分のペースで集中したいため、基本的に一人で進めたい。",
        "文化祭や体育祭などの学校行事では、みんなでワイワイ話し合いながら協力して何かを創り上げるのが好きだ。",
        "文化祭や体育祭などの学校行事では、グループ全体の話し合いよりも自分に割り振られた役割や作業を一人で黙々とこなす方が好きだ。",
        "休日は、一人で過ごすよりも友達を誘ってグループで遊びに行くことが多い。",
        "休日は、大勢で集まって遊ぶよりも一人または親しい友人と二人きりで静かに過ごしたい。"
    ];

    const form = document.getElementById('quiz-form');
    if (!form) return;

    // --- 質問フォームを動的に生成 ---
    let questionsHtml = '';
    questions.forEach((q, index) => {
        const qNum = index + 1;
        questionsHtml += `
            <div class="question-block">
                <p class="question-number">質問 ${qNum}/24</p>
                <p class="question-text">${q}</p>
                <div class="slider-container">
                    <span class="slider-label">同意しない</span>
                    <input type="range" name="q${qNum}" min="0" max="10" step="1" value="5" class="slider">
                    <span class="slider-label">同意する</span>
                </div>
            </div>
        `;
    });
    form.innerHTML = questionsHtml + '<button type="submit" id="submit-button">診断する</button>';

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const allValues = [];
        for (let i = 1; i <= 24; i++) {
            allValues.push(formData.get('q' + i));
        }

        const uniqueValues = new Set(allValues);
        if (uniqueValues.size === 1) {
            window.location.href = 'st_error.html'; // 生徒版エラーページへ
            return;
        }

        let scores = { A: 0, C: 0, I: 0, L: 0, M: 0, R: 0, T: 0, S: 0 };
        const questionDirections = {
            1: 'A', 2: 'C', 3: 'A', 4: 'C', 5: 'A', 6: 'C',
            7: 'I', 8: 'L', 9: 'I', 10: 'L', 11: 'I', 12: 'L',
            13: 'M', 14: 'R', 15: 'M', 16: 'R', 17: 'M', 18: 'R',
            19: 'T', 20: 'S', 21: 'T', 22: 'S', 23: 'T', 24: 'S'
        };

        for (let i = 1; i <= 24; i++) {
            const value = formData.get('q' + i);
            const score = parseInt(value);
            const direction = questionDirections[i];
            scores[direction] += score;
        }
        
        const resultType1 = scores.A >= scores.C ? 'A' : 'C';
        const resultType2 = scores.I >= scores.L ? 'I' : 'L';
        const resultType3 = scores.M >= scores.R ? 'M' : 'R';
        const resultType4 = scores.T >= scores.S ? 'T' : 'S';

        const finalType = resultType1 + resultType2 + resultType3 + resultType4;
        
        triggerVibration(50); // まず振動させる
        setTimeout(() => {   // 少し待ってからページを移動する
            window.location.href = 'st_type/' + finalType + '.html'; 
        }, 100); // 100ミリ秒（0.1秒）待つ
    });
});