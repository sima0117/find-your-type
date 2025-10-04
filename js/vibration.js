// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 20) {
    // navigator.vibrateが利用可能かチェック
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // --- 静的なボタンへの適用 ---
    // document全体でクリックを監視し、クリックされた要素が対象クラスを持つか判定
    document.addEventListener('click', function(e) {
        if (e.target.closest('.button-link, .nav-card')) {
            // 診断ボタンは診断スクリプト側で個別に制御するため除外
            if (e.target.type !== 'submit') {
                triggerVibration(20);
            }
        }
    });

    // --- スライダーへの適用（イベントデリゲーション） ---
    // document全体でスライダーの動きを監視
    document.addEventListener('input', function(e) {
        // イベントを発生させた要素が.sliderクラスを持っているか判定
        if (e.target.classList.contains('slider')) {
            const slider = e.target;
            
            // 現在の値と、要素に保存された「直前の値」を比較
            if (slider.value !== slider.dataset.lastValue) {
                triggerVibration(10); // 違う場合のみ振動させる
            }

            // 現在の値を「直前の値」として要素に保存し、次のイベントに備える
            slider.dataset.lastValue = slider.value;
        }
    });
});