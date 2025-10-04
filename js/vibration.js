// 他のスクリプトからも呼び出せるように、グローバルな関数として定義
function triggerVibration(duration = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// スライダーにバイブレーション機能を設定する関数
function setupSliderVibration(slider) {
    // 既に設定済みの場合はスキップ
    if (slider.dataset.vibrationSetup === 'true') {
        return;
    }
    
    // 初期値を記録
    slider.dataset.lastValue = slider.value;
    slider.dataset.vibrationSetup = 'true';
    
    // touchstartで初期化（ブラウザのバイブレーション許可を得る）
    slider.addEventListener('touchstart', () => {
        triggerVibration(1); // 極めて短い振動
    }, { passive: true });

    // inputイベントで値の変更を検知して振動
    slider.addEventListener('input', () => {
        if (slider.value !== slider.dataset.lastValue) {
            triggerVibration(10);
            slider.dataset.lastValue = slider.value;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 静的なボタンへの適用 ---
    document.addEventListener('click', function(e) {
        if (e.target.closest('.button-link, .nav-card')) {
            if (e.target.type !== 'submit') {
                triggerVibration(20);
            }
        }
    });

    // --- スライダーの動的監視 ---
    // MutationObserverでDOM変更を監視し、新しいスライダーを自動検知
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // 追加されたノードがエレメントの場合
                if (node.nodeType === 1) {
                    // ノード自体がスライダーの場合
                    if (node.classList && node.classList.contains('slider')) {
                        setupSliderVibration(node);
                    }
                    // ノードの子孫にスライダーがある場合
                    const sliders = node.querySelectorAll && node.querySelectorAll('.slider');
                    if (sliders) {
                        sliders.forEach(setupSliderVibration);
                    }
                }
            });
        });
    });

    // body全体を監視対象にする
    observer.observe(document.body, {
        childList: true,    // 子ノードの追加・削除を監視
        subtree: true       // 子孫ノード全体を監視
    });

    // 既存のスライダーにも適用（念のため）
    setTimeout(() => {
        const existingSliders = document.querySelectorAll('.slider');
        existingSliders.forEach(setupSliderVibration);
    }, 100);

});