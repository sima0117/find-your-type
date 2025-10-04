// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 他の全ての初期化処理が終わった後に実行する
    setTimeout(function() {

        // --- 静的なボタンへの適用 ---
        document.addEventListener('click', function(e) {
            if (e.target.closest('.button-link, .nav-card')) {
                if (e.target.type !== 'submit') {
                    triggerVibration(20);
                }
            }
        });

        // --- スライダーへの最終適用ロジック ---
        const sliders = document.querySelectorAll('.slider');

        sliders.forEach(slider => {
            // 初期値を記録
            slider.dataset.lastValue = slider.value;
            
            // 【重要】touchstartで「無音の振動」を発生させ、バイブレーション許可を得る
            slider.addEventListener('touchstart', () => {
                triggerVibration(1); // 極めて短い振動で初期化（ほぼ感じない）
            }, { passive: true });

            // inputイベントで値の変更を検知して振動
            slider.addEventListener('input', () => {
                if (slider.value !== slider.dataset.lastValue) {
                    triggerVibration(10);
                    slider.dataset.lastValue = slider.value;
                }
            });
        });

    }, 100); 

});