// ----- 原因究明のための最終テストコード -----
document.addEventListener('DOMContentLoaded', function() {
    
    setTimeout(function() {
        console.log("Final diagnostic script running...");

        const sliders = document.querySelectorAll('.slider');

        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                // スライダーが動いたことを検知したら、何が何でも背景を赤くする
                document.body.style.backgroundColor = 'red';
                console.log("SUCCESS: Slider 'input' event was detected!");
            });
        });

    }, 100);
});
// ----- 最終テストコード ここまで -----