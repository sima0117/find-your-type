document.addEventListener('DOMContentLoaded', function() {

    // --- バイブレーション関数 ---
    function triggerVibration(duration = 10) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    // --- ボタンへの適用（イベントデリゲーション） ---
    // document全体でクリックを監視し、クリックされた要素が対象クラスを持つか判定
    document.addEventListener('click', function(e) {
        // .button-link または .nav-card を持つ要素、あるいはその子要素がクリックされた場合
        if (e.target.closest('.button-link, .nav-card')) {
            triggerVibration(50);
        }
    });

    // --- スライダーへの適用（イベントデリゲーション） ---
    // document全体でスライダーの動きを監視
    document.addEventListener('input', function(e) {
        // イベントを発生させた要素が.sliderクラスを持っているか判定
        if (e.target.classList.contains('slider')) {
            const slider = e.target;
            // このスライダー用の直前の値を、要素自体に保存（なければ初期化）
            const lastValue = slider.dataset.lastValue || slider.value;

            if (slider.value !== lastValue) {
                triggerVibration(20); // 短い「コツッ」という感触
                // 現在の値を「直前の値」として要素に保存
                slider.dataset.lastValue = slider.value;
            }
        }
    });

});