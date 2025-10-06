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
        const path = window.location.pathname;

        // URLパスから、'tt' or 'st' のどちらの診断かを判定
        let diagnosisKey = null;
        if (path.includes('/tt_')) {
            diagnosisKey = 'teacherTeacher';
        } else if (path.includes('/st_')) {
            diagnosisKey = 'studentStudent';
        }
        // 将来的にgtを追加する場合はここに else if (path.includes('/gt_')) を追加

        if (diagnosisKey) {
            descriptionElements.forEach(el => {
                const compatType = el.dataset.compatType;
                const partnerType = el.dataset.partnerType;
                const key = [selfType, partnerType].sort().join('_');
                
                // 動的に決定したキー（teacherTeacher or studentStudent）を使ってデータを参照
                if (compatData[diagnosisKey] && compatData[diagnosisKey][compatType] && compatData[diagnosisKey][compatType][key]) {
                    el.innerHTML = compatData[diagnosisKey][compatType][key];
                } else {
                    el.innerHTML = "解説文が見つかりませんでした。";
                }
            });
        }
    }

    // --- シェアボタンのリンクを自動生成する機能 ---
    const shareTwitter = document.getElementById('share-twitter');
    const shareLine = document.getElementById('share-line');

    if (shareTwitter && shareLine) {
        const pageUrl = window.location.href;
        const pageTitle = document.title;
        
        let shareIntro = '私のタイプは'; // デフォルトの文章
        let hashtag = '#FindYourType'; // デフォルトのハッシュタグ
        const path = window.location.pathname;

        // URLのパスに 'tt_' が含まれる場合
        if (path.includes('/tt_')) {
            shareIntro = '私の教師タイプは';
            hashtag = '#TeacherType16';
        
        // URLのパスに 'st_' が含まれる場合
        } else if (path.includes('/st_')) {
            shareIntro = '私の生徒タイプは';
            hashtag = '#StudentType16';

        // URLのパスに 'gt_' が含まれる場合
        } else if (path.includes('/gt_')) {
            shareIntro = '私のゲーマータイプは';
            hashtag = '#GamerType16';
        }

        // 判定したテキストを元に、最終的なシェア文を組み立てる
        const shareText = `${shareIntro}『${pageTitle}』でした！ あなたも診断してみよう！ ${hashtag}`;
        
        shareTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
        shareLine.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    }
});