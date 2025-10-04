document.addEventListener("DOMContentLoaded", function() {
    // ゲーマー用の質問リスト（全24問）
    const questions = [
        // A/E: プレイの目的
        "ゲームをプレイする目的は、設定された全ての要素（実績、アイテム、隠しボス等）を制覇し、「実績」を達成することにある。",
        "ゲームをプレイする目的は、その世界の住人になったかのように物語に没入し、心を揺さぶるような「体験」をすることにある。",
        "ゲームとは、乗り越えるべき「挑戦」である。難しい課題をクリアし、自身のスキルが向上していく過程にこそ価値がある。",
        "ゲームとは、もう一つの「人生」である。その世界の住人となり、物語を体験し、様々な感情を味わうことにこそ価値がある。",
        "人生の価値は、困難な目標を設定し、それを乗り越えるために自身のスキルを磨き、「成長」を実感することにある。",
        "人生の価値は、結果を求めることよりも、その過程で様々な出来事に遭遇し、心を揺さぶるような「感情」を体験することにある。",
        // T/I: 思考のスタイル
        "ゲームをプレイする上で最も興味があるのは、キャラクターの性能やスキルの効果といった、ゲームを構成する「ルール」や「数値」そのものである。",
        "ゲームをプレイする上で最も興味があるのは、キャラクターの設定や物語の背景といった、ゲームの世界を構成する「ストーリー」そのものである。",
        "どのようなゲームをプレイしていても、無意識に「どうすればもっと効率的に進められるか」という最適解を考えてしまう。",
        "物語が重要なゲームでは、たとえ遠回りになっても、キャラクターの心情に寄り添い、物語の雰囲気を壊さないような選択をしたい。",
        "何か重要な物事を決める時、感情や第一印象に流されず、客観的な情報やデータを徹底的に比較・分析して判断する。",
        "何か重要な物事を決める時、細かいデータよりも、その選択肢が持つストーリーや、自分の直感を信じる。",
        // D/R: 挑戦への姿勢
        "強敵に何度も負けて「ゲームオーバー」を繰り返すことは、苦痛ではなく、「どうすれば勝てるか」を考える、燃えるような挑戦の一部だ。",
        "同じボスやステージで何度も失敗すると、楽しさよりもストレスが上回り、そのゲームを続けるのが嫌になってしまうことがある。",
        "ゲームは、常に緊張感があり、一瞬の油断がゲームオーバーに繋がるような、ギリギリの状況でこそ最も面白いと感じる。",
        "ゲームは、圧倒的な力で敵をなぎ倒したり、誰にも邪魔されず自分のペースで作業したりできるような、ストレスのない状況でこそ最も楽しめる。",
        "休日や余暇の時間は、新しいスキルを習得したり、自分の限界に挑戦したりするなど、自分を成長させるための「自己投資」の時間として使いたい。",
        "休日や余暇の時間は、難しいことを考えたり挑戦したりするのではなく、心身ともにリラックスさせ、日々の疲れを「癒す」ための時間として使いたい。",
        // C/S: 他者との関係
        "ゲームをプレイする一番の目的は、話題のゲームを友達と一緒に遊んで、共通の体験や感動を分ち合うことだ。",
        "ゲームをプレイする一番の目的は、誰にも邪魔されず、自分のペースでゲームの世界に没入することだ。",
        "どれだけ評価が高いゲームでも、マルチプレイ機能がなく、友達と一緒に遊べないと知ると、購入をためらってしまう。",
        "マルチプレイがメインのゲームでも、一人でストーリーや世界観をじっくり楽しめるモードがないと、あまり魅力を感じない。",
        "楽しいことや嬉しい出来事があった時、その興奮を誰かとすぐに共有したくなる。",
        "楽しいことや嬉しい出来事があった時、まずは一人でその喜びや感動を心の中で噛みしめたい。"
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
                    <input type="range" name="q${qNum}" min="0" max="10" step="1" value="5" class="slider" data-last-value="-1">
                    <span class="slider-label">同意する</span>
                </div>
            </div>
        `;
    });
    // フォームに生成したHTMLと送信ボタンを追加
    form.innerHTML = questionsHtml + '<button type="submit" class="button-link">診断する</button>';

    // --- フォーム送信時の処理 ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // --- スコア計算 ---
        const formData = new FormData(event.target);
        
        const allValues = [];
        for (let i = 1; i <= 24; i++) {
            allValues.push(formData.get('q' + i));
        }
        const uniqueValues = new Set(allValues);
        if (uniqueValues.size === 1) {
            window.location.href = 'gt_error.html'; // ゲーマー版エラーページへ
            return;
        }

        let scores = { A: 0, E: 0, D: 0, R: 0, T: 0, I: 0, C: 0, S: 0 };
        const questionDirections = {
            1: 'A', 2: 'E', 3: 'A', 4: 'E', 5: 'A', 6: 'E',
            7: 'T', 8: 'I', 9: 'T', 10: 'I', 11: 'T', 12: 'I',
            13: 'D', 14: 'R', 15: 'D', 16: 'R', 17: 'D', 18: 'R',
            19: 'C', 20: 'S', 21: 'C', 22: 'S', 23: 'C', 24: 'S'
        };

        for (let i = 1; i <= 24; i++) {
            const value = formData.get('q' + i);
            const score = parseInt(value, 10);
            const direction = questionDirections[i];
            if (direction) {
                scores[direction] += score;
            }
        }
        
        // --- タイプ判定 ---
        const resultType1 = scores.A >= scores.E ? 'A' : 'E';
        const resultType2 = scores.D >= scores.R ? 'D' : 'R';
        const resultType3 = scores.T >= scores.I ? 'T' : 'I';
        const resultType4 = scores.C >= scores.S ? 'C' : 'S';

        const finalType = resultType1 + resultType2 + resultType3 + resultType4;
        
        triggerVibration(50); // まず振動させる
        setTimeout(() => {   // 少し待ってからページを移動する
            window.location.href = 'gt_type/' + finalType + '.html'; 
        }, 100); // 100ミリ秒（0.1秒）待つ
    });
});