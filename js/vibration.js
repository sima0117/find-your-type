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

        // --- スライダーへの新しい適用ロジック ---
        const sliders = document.querySelectorAll('.slider');

        sliders.forEach(slider => {
            // 各スライダーに対して、値が変化したことを検知する 'input' イベントリスナーを直接設定
            slider.addEventListener('input', () => {
                triggerVibration(10);
            });
        });

    }, 100); // 念のため、0.1秒の僅かな待機時間を設ける
});