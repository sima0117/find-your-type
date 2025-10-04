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
            
            // ドラッグ中の処理を定義
            const onPointerMove = () => {
                // 現在の値と直前の値を比較
                if (slider.value !== slider.dataset.lastValue) {
                    triggerVibration(10);
                }
                // 直前の値を更新
                slider.dataset.lastValue = slider.value;
            };

            // つまみを掴んだ瞬間の処理
            slider.addEventListener('pointerdown', () => {
                // まずは直前の値を記録
                slider.dataset.lastValue = slider.value;
                // ドラッグ中のイベント監視を開始
                slider.addEventListener('pointermove', onPointerMove);
            });

            // つまみを離した瞬間の処理
            slider.addEventListener('pointerup', () => {
                // ドラッグ中のイベント監視を終了（負荷軽減のため）
                slider.removeEventListener('pointermove', onPointerMove);
            });
            
            // つまみからカーソルが外れた場合も監視を終了
            slider.addEventListener('pointerleave', () => {
                slider.removeEventListener('pointermove', onPointerMove);
            });
        });

    }, 100);
});