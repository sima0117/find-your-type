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
        // ページ上にある全てのスライダーを取得
        const sliders = document.querySelectorAll('.slider');

        // 見つけ出したスライダー、一つ一つに対して処理を行う
        sliders.forEach(slider => {
            
            // 1. まず、JavaScriptで初期値を強制的に記録する
            slider.dataset.lastValue = slider.value;

            // 2. その後、スライダーごとにイベントリスナーを直接設定する
            slider.addEventListener('input', () => {
                // 現在の値と、記録された「直前の値」を比較
                if (slider.value !== slider.dataset.lastValue) {
                    triggerVibration(10); // 違う場合のみ振動させる
                }
                // 現在の値を「直前の値」として更新し、次のイベントに備える
                slider.dataset.lastValue = slider.value;
            });
        });

    }, 100); 

});