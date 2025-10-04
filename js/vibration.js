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

        // スライダーへの適用
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('slider')) {
                const slider = e.target;
                
                if (slider.value !== slider.dataset.lastValue) {
                    triggerVibration(10);
                }
                
                slider.dataset.lastValue = slider.value;
            }
        });

    }, 100); // 念のため、0.1秒の僅かな待機時間を設ける

});

// スライダーへの適用
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('slider')) {
        const slider = e.target;
        if (slider.value !== slider.dataset.lastValue) {
            triggerVibration(10);
        }
        slider.dataset.lastValue = slider.value;
    }
});

// ★ 追加：つまみを掴んだ瞬間にも振動させる
document.addEventListener('pointerdown', function(e) {
    if (e.target.classList.contains('slider')) {
        triggerVibration(30);
    }
});