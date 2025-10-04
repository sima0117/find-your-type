// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 他の処理が完了した後にイベントリスナーを設定
    setTimeout(function() {

        // --- 静的なボタンへの適用 ---
        document.addEventListener('click', function(e) {
            if (e.target.closest('.button-link, .nav-card')) {
                if (e.target.type !== 'submit') {
                    // ユーザー設定の振動時間（ボタン用）
                    triggerVibration(20);
                }
            }
        });

        // --- スライダーへの適用（ロジック改良版） ---
        
        // スライダーを「押し込んだ」瞬間に、現在の値を記録する関数
        function primeSlider(event) {
            if (event.target.classList.contains('slider')) {
                event.target.dataset.lastValue = event.target.value;
            }
        }

        // PCでのマウス操作に対応
        document.addEventListener('mousedown', primeSlider);
        // スマホでのタッチ操作に対応
        document.addEventListener('touchstart', primeSlider);

        // スライダーが「動かされた」瞬間に、値の変化を比較して振動させる
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('slider')) {
                const slider = e.target;
                
                if (slider.value !== slider.dataset.lastValue) {
                    // ユーザー設定の振動時間（スライダー用）
                    triggerVibration(10);
                }
                
                // 現在の値を次の比較のために保存
                slider.dataset.lastValue = slider.value;
            }
        });

    }, 0);
});