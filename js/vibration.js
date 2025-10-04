// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 20) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // --- 静的なボタンへの適用 ---
    // ページ読み込み時に存在するボタン（.button-link, .nav-card）に適用
    document.addEventListener('click', function(e) {
        if (e.target.closest('.button-link, .nav-card')) {
            // ただし、診断ボタンは除外（診断スクリプト側で個別に制御するため）
            if (e.target.type !== 'submit') {
                triggerVibration(50);
            }
        }
    });

    // --- スライダーへの適用（イベントデリゲーション） ---
    // document全体でスライダーの動きを監視
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('slider')) {
            const slider = e.target;
            const lastValue = slider.dataset.lastValue || slider.value;
            if (slider.value !== lastValue) {
                triggerVibration(20);
                slider.dataset.lastValue = slider.value;
            }
        }
    });
});