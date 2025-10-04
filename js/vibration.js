// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 20) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// DOMContentLoadedは、HTMLの読み込みが完了した時点で発火する
document.addEventListener('DOMContentLoaded', function() {
    
    // setTimeoutを使い、他の処理が終わった後で実行されるようにする
    setTimeout(function() {

        // --- 静的なボタンへの適用 ---
        document.addEventListener('click', function(e) {
            if (e.target.closest('.button-link, .nav-card')) {
                // 診断ボタンは診断スクリプト側で個別に制御するため除外
                if (e.target.type !== 'submit') {
                    triggerVibration(50);
                }
            }
        });

        // --- スライダーへの適用 ---
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('slider')) {
                const slider = e.target;
                
                // 現在の値と、要素に保存された「直前の値」を比較
                if (slider.value !== slider.dataset.lastValue) {
                    // ユーザーが変更した数値を反映して振動時間を調整
                    const changedValue = slider.dataset.lastValue ? Math.abs(slider.value - slider.dataset.lastValue) : 1;
                    triggerVibration(10 + changedValue); // 最小11ms, 最大20ms
                }

                // 現在の値を「直前の値」として要素に保存し、次のイベントに備える
                slider.dataset.lastValue = slider.value;
            }
        });

    }, 0); // 0ミリ秒後に実行するが、実際には他の処理の後になる

});