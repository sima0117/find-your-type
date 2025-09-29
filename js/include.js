document.addEventListener("DOMContentLoaded", function() {
    // basePathがHTML側で定義されていない場合の初期値を設定
    const basePath = window.basePath || '';

    // --- ヘッダーとフッターを読み込む機能 ---
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch(basePath + 'partials/_header.html') 
            .then(response => response.ok ? response.text() : Promise.reject('Header not found'))
            .then(data => {
                headerPlaceholder.innerHTML = data;
            }).catch(error => console.error('Error loading header:', error));
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch(basePath + 'partials/_footer.html') 
            .then(response => response.ok ? response.text() : Promise.reject('Footer not found'))
            .then(data => {
                footerPlaceholder.innerHTML = data;
            }).catch(error => console.error('Error loading footer:', error));
    }

    // --- 相性解説文を自動で挿入する機能 ---
    const resultPage = document.getElementById('result-page');
    if (typeof compatData !== 'undefined' && resultPage) {
        const selfType = resultPage.dataset.selfType;
        const descriptionElements = document.querySelectorAll('.compat-description');

        descriptionElements.forEach(el => {
            const compatType = el.dataset.compatType;
            const partnerType = el.dataset.partnerType;
            const key = [selfType, partnerType].sort().join('_');
            if (compatData.teacherTeacher[compatType] && compatData.teacherTeacher[compatType][key]) {
                el.innerHTML = compatData.teacherTeacher[compatType][key];
            } else {
                el.innerHTML = "解説文が見つかりませんでした。";
            }
        });
    }

    // --- シェアボタンのリンクを自動生成する機能 ---
    const shareTwitter = document.getElementById('share-twitter');
    const shareLine = document.getElementById('share-line');

    if (shareTwitter && shareLine) {
        const pageUrl = window.location.href;
        const pageTitle = document.title;
        const shareText = `私の教師タイプは『${pageTitle}』でした！ あなたも診断してみよう！ #教師のための16タイプ診断`;

        shareTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
        shareLine.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    }
});