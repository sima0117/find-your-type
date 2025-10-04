// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 他の全ての初期化処理が終わった後に、満を持して実行する
    setTimeout(function() {

        // --- スライダーの初期化 ---
        // ページ上にある全てのスライダーを取得
        const sliders = document.querySelectorAll('.slider');
        // 各スライダーの「最初の値」を強制的に記録する
        sliders.forEach(slider => {
            slider.dataset.lastValue = slider.value;

            // ▼ スライダーごとに直接イベントを登録 ▼

            // つまみを掴んだ瞬間（pointerdown / touchstart）
            slider.addEventListener('pointerdown', () => {
                triggerVibration(30);
            });

            slider.addEventListener('touchstart', () => {
                triggerVibration(30);
            }, { passive: true });

            // 値が変わったとき（input）
            slider.addEventListener('input', () => {
                if (slider.value !== slider.dataset.lastValue) {
                    triggerVibration(10);
                }
                slider.dataset.lastValue = slider.value;
            });

            // 値を確定したとき（change）
            slider.addEventListener('change', () => {
                triggerVibration(20);
            });
        });

        // --- イベントリスナーの設定 ---

        // 静的なボタンへの適用
        document.addEventListener('click', function(e) {
            if (e.target.closest('.button-link, .nav-card')) {
                if (e.target.type !== 'submit') {
                    triggerVibration(20);
                }
            }
        });

    }, 100); // 念のため、0.1秒の僅かな待機時間を設ける

});
