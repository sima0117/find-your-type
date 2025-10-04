document.addEventListener('DOMContentLoaded', function() {

    // --- バイブレーション関数 ---
    // 引数で指定された時間（ミリ秒）だけ振動させる
    // ブラウザがVibration APIに対応していない場合は何もしない
    function triggerVibration(duration = 10) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    // --- ボタンへの適用 ---
    // 'button-link'クラスを持つ全ての要素を取得
    const buttons = document.querySelectorAll('.button-link');
    buttons.forEach(button => {
        // 各ボタンがクリックされた時に、50ミリ秒の振動を発生させる
        button.addEventListener('click', function() {
            triggerVibration(50);
        });
    });

    // --- スライダーへの適用 ---
    // 'slider'クラスを持つ全ての要素を取得
    const sliders = document.querySelectorAll('.slider');
    let lastSliderValue = {}; // 各スライダーの直前の値を保持するオブジェクト

    sliders.forEach((slider, index) => {
        // 各スライダーにユニークなIDがない場合でも識別できるように、インデックスをキーとして使用
        const sliderId = slider.name || `slider-${index}`;
        lastSliderValue[sliderId] = slider.value;

        // スライダーが動かされている間、連続してイベントが発生
        slider.addEventListener('input', function() {
            // 値が変化した瞬間だけ振動させる（押しっぱなしでの連続振動を防ぐ）
            if (this.value !== lastSliderValue[sliderId]) {
                triggerVibration(20); // 短い「コツッ」という感触
                lastSliderValue[sliderId] = this.value;
            }
        });
    });

});