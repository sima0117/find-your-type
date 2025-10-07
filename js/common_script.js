document.addEventListener("DOMContentLoaded", function () {
  let diagnosisData;
  let config;

  // どの診断のデータが読み込まれているかを判定
  if (typeof studentQuestions !== "undefined") {
    diagnosisData = studentQuestions;
    config = {
      typePrefix: "st",
      axes: [
        ["A", "C"],
        ["I", "L"],
        ["M", "R"],
        ["T", "S"],
      ],
    };
  } else if (typeof teacherQuestions !== "undefined") {
    diagnosisData = teacherQuestions;
    config = {
      typePrefix: "tt",
      axes: [
        ["A", "O"],
        ["L", "P"],
        ["D", "C"],
        ["I", "G"],
      ],
    };
  } else if (typeof teacherQuestions !== "undefined") {
    diagnosisData = teacherQuestions;
    config = {
      typePrefix: "tt",
      axes: [
        ["O", "A"],
        ["P", "L"],
        ["C", "D"],
        ["G", "I"],
      ],
    };
  }

  // 診断データが見つからない場合はここで処理を終了
  if (!diagnosisData) {
    console.error("診断の質問データが見つかりません。");
    return;
  }

  const form = document.getElementById("quiz-form");
  if (!form) return;

  // --- 1. 質問フォームを動的に生成 ---
  let questionsHtml = "";
  const totalQuestions =
    diagnosisData.sliderQuestions.length +
    diagnosisData.decisiveQuestions.length;

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

  form.innerHTML =
    questionsHtml +
    '<button type="submit" class="button-link">診断結果を見る</button>';

  // --- 2. フォーム送信時の処理 ---
  form.addEventListener("submit", function (event) {
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
    config.axes.flat().forEach((letter) => (scores[letter] = 0));

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
    let finalType = "";
    config.axes.forEach((pair) => {
      const type1 = pair[0]; // 例: 'O'
      const type2 = pair[1]; // 例: 'A'
      finalType += scores[type1] >= scores[type2] ? type1 : type2;
    }); // --- 5. URLパラメータ用のスコアを計算 --- // (A) スライダーの位置を決めるためのスコア (v1-v4)
    const finalScoresForSlider = config.axes.map((pair) => {
      const scoreForType1 = scores[pair[0]];
      const scoreForType2 = scores[pair[1]];
      const totalScore = scoreForType1 + scoreForType2;
      if (totalScore === 0) return 50;
      return Math.round((scoreForType1 / totalScore) * 100);
    }); // (B) 表示用の「優勢なタイプのパーセンテージ」 (p1-p4)

    const finalPercentagesForDisplay = config.axes.map((pair, index) => {
      const dominantLetter = finalType[index];
      const score1 = scores[pair[0]];
      const score2 = scores[pair[1]];
      const totalScore = score1 + score2;
      if (totalScore === 0) return 50;

      const dominantScore = dominantLetter === pair[0] ? score1 : score2;
      return Math.round((dominantScore / totalScore) * 100);
    }); // --- 6. 結果ページへ遷移 ---
    triggerVibration(50);
    setTimeout(() => {
      const sliderParams = `v1=${finalScoresForSlider[0]}&v2=${finalScoresForSlider[1]}&v3=${finalScoresForSlider[2]}&v4=${finalScoresForSlider[3]}`;
      const displayParams = `p1=${finalPercentagesForDisplay[0]}&p2=${finalPercentagesForDisplay[1]}&p3=${finalPercentagesForDisplay[2]}&p4=${finalPercentagesForDisplay[3]}`;
      window.location.href = `${config.typePrefix}_type/${finalType}.html?${sliderParams}&${displayParams}`;
    }, 100);
  });
});
