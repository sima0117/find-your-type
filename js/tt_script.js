document.addEventListener("DOMContentLoaded", function() {
    // 質問リスト（全24問）
    const questions = [
        "授業の冒頭でその時間の学習内容とゴールを明確に伝え、それに沿って進行することを重視する。",
        "生徒から面白い質問が出たら、たとえ授業計画から外れてもその探求に時間をかける価値があると思う。",
        "校則やクラスのルールは、集団の秩序を維持するために全員が例外なく厳密に従うべきだ。",
        "生徒が校則に疑問を持った場合、一方的に従わせるのではなく、その意味や必要性について対話する機会を持つべきだ。",
        "物事を決める際は、伝統や過去の実績、確立された手順を尊重することが重要だ。",
        "物事を決める際は、常識にとらわれず、新しい可能性や個人の直感を信じることが重要だ。",
        "教師としての最大の喜びは、生徒との心の繋がりやその成長のドラマに立ち会える人間的な感動にある。",
        "教師としての最大の喜びは、複雑な物事を分かりやすく解説し、生徒のスキルが向上したと客観的に確認できる知的な満足感にある。",
        "教師として成長するためには、多くの研修に参加するよりも日々の生徒との関わりの中で得られる経験の積み重ねが最も重要だ。",
        "教師として成長するためには、自身の経験則に頼るだけでなく最新の教育理論や指導法を学び自分の実践を客観的に分析し続けることが不可欠だ。",
        "大きな決断を迫られた時、最終的に信じるのは自分自身の「直感」や「想いの強さ」だ。",
        "大きな決断を迫られた時、「客観的な情報」や「データ」を徹底的に分析して判断する。",
        "生徒との信頼関係は、まず自分から心を開き人間的な側面を見せることから始まると考えている。",
        "生徒との適切な関係を保つためには、プライベートな側面を見せすぎず一定の距離感を保つことが重要だ。",
        "生徒の力になれるのであれば、勤務時間外や休日でも相談に乗ったりすることにあまり抵抗はない。",
        "教師としての仕事とプライベートは明確に分けたいので、勤務時間外の生徒との関わりは最小限にしたい。",
        "プライベートでは、新しく出会った人ともすぐに打ち解け自分のことを話すのが好きだ。",
        "プライベートでは、たとえ親しい友人であってもお互いの領域に踏み込みすぎない節度ある関係を好む。",
        "優れたクラスとは、生徒同士が協力し合い、集団として高い成果を出せるクラスのことだ。",
        "優れたクラスとは、生徒一人ひとりが安心して自分の個性や才能を発揮できるクラスのことだ。",
        "集団の中での立ち位置を客観的に示すことで、健全な競争心を促すべきだ。",
        "他人との比較ではなく、その生徒自身の過去からの「伸び」を認め、励ますことを最優先すべきだ。",
        "何か問題を決める時、個人の意見よりも組織やチーム全体の利益と調和を最優先に考えるべきだ。",
        "何か問題を決める時、組織の都合よりも影響を受ける一人ひとりの個人的な事情や感情に配慮すべきだ。"
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
            // ▼▼▼ 無効回答ページのパスを修正 ▼▼▼
            window.location.href = 'tt_error.html'; 
            return;
        }

        let scores = { O: 0, A: 0, P: 0, L: 0, C: 0, D: 0, G: 0, I: 0 };
        const questionDirections = {
            1: 'O', 2: 'A', 3: 'O', 4: 'A', 5: 'O', 6: 'A',
            7: 'P', 8: 'L', 9: 'P', 10: 'L', 11: 'P', 12: 'L',
            13: 'C', 14: 'D', 15: 'C', 16: 'D', 17: 'C', 18: 'D',
            19: 'G', 20: 'I', 21: 'G', 22: 'I', 23: 'G', 24: 'I'
        };

        for (let i = 1; i <= 24; i++) {
            const value = formData.get('q' + i);
            const score = parseInt(value);
            const direction = questionDirections[i];
            scores[direction] += score;
        }
        
        const resultType1 = scores.O >= scores.A ? 'O' : 'A';
        const resultType2 = scores.P >= scores.L ? 'P' : 'L';
        const resultType3 = scores.C >= scores.D ? 'C' : 'D';
        const resultType4 = scores.G >= scores.I ? 'G' : 'I';

        const finalType = resultType1 + resultType2 + resultType3 + resultType4;
        
        window.location.href = 'tt_type/' + finalType + '.html'; 
    });
});