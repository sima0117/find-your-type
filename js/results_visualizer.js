document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("score-visualizer-placeholder");
  if (!container) return;

  const params = new URLSearchParams(window.location.search); // スライダー位置用のスコア (v1-v4)
  const sliderPositions = [
    parseInt(params.get("v1"), 10),
    parseInt(params.get("v2"), 10),
    parseInt(params.get("v3"), 10),
    parseInt(params.get("v4"), 10),
  ]; // 表示用のパーセンテージ (p1-p4)
  const displayPercentages = [
    parseInt(params.get("p1"), 10),
    parseInt(params.get("p2"), 10),
    parseInt(params.get("p3"), 10),
    parseInt(params.get("p4"), 10),
  ];

  if (sliderPositions.some(isNaN) || displayPercentages.some(isNaN)) return;

  const axisData = {
    tt: [
      {
        title: "①重視するもの",
        left: "規律と秩序 (O)",
        right: "主体と自由 (A)",
      },
      { title: "②指導の源泉", left: "情熱 (P)", right: "論理 (L)" },
      { title: "③生徒との距離感", left: "近い (C)", right: "遠い (D)" },
      { title: "④指導の対象", left: "集団 (G)", right: "個別 (I)" },
    ],
    st: [
      /* ... st ... */
    ],
    gt: [
      /* ... gt ... */
    ],
  };
  const axisLetters = {
    tt: ["O", "P", "C", "G"],
    st: ["A", "I", "M", "T"],
    gt: ["A", "D", "T", "C"],
  };

  const path = window.location.pathname;
  let diagnosisType = null;
  if (path.includes("/tt_")) diagnosisType = "tt";
  else if (path.includes("/st_")) diagnosisType = "st";
  else if (path.includes("/gt_")) diagnosisType = "gt";
  if (!diagnosisType) return;

  const selfTypeElement = document.getElementById("result-page");
  const selfType = selfTypeElement ? selfTypeElement.dataset.selfType : null;
  if (!selfType) return;

  const labels = axisData[diagnosisType];
  const leftLetters = axisLetters[diagnosisType];
  let visualizerHTML = '<div class="score-visualizer-wrapper">';

  sliderPositions.forEach((sliderPos, index) => {
    const percentage = displayPercentages[index];
    const userLetter = selfType[index];
    const isLeftDominant = userLetter === leftLetters[index];
    const dominantLabel = isLeftDominant
      ? labels[index].left
      : labels[index].right;

    visualizerHTML += `
            <div class="score-bar-container">
                <div class="score-percentage">
                  <strong>${labels[index].title}：${dominantLabel} ${percentage}%</strong>
                </div>
                <div class="score-bar">
                  <div class="score-bar-inner" style="width: ${sliderPos}%;">
                      <div class="score-bar-marker"></div>
                  </div>
                </div>
                <div class="score-labels">
                  <span>${labels[index].left}</span>
                  <span>${labels[index].right}</span>
                </div>
              </div>
      `;
  });

  visualizerHTML += "</div>";
  container.innerHTML = visualizerHTML;
});
