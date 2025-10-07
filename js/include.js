document.addEventListener("DOMContentLoaded", function() {
    // basePathがHTML側で定義されていない場合の初期値を設定
    const basePath = window.basePath || '';

    // --- 診断タイプをURLから一度だけ判定する ---
    const path = window.location.pathname;
    let diagnosisType = null;
    if (path.includes('/tt_')) {
        diagnosisType = 'tt';
    } else if (path.includes('/st_')) {
        diagnosisType = 'st';
    } else if (path.includes('/gt_')) {
        diagnosisType = 'gt';
    }

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
    // compatDataが定義されており、かつ診断タイプが特定できた場合のみ実行
    if (typeof compatData !== 'undefined' && resultPage && diagnosisType) {
        const selfType = resultPage.dataset.selfType;
        const descriptionElements = document.querySelectorAll('.compat-description');
        
        // 診断タイプに応じたデータキーを決定
        let diagnosisKey;
        if (diagnosisType === 'tt') {
            diagnosisKey = 'teacherTeacher';
        } else if (diagnosisType === 'st') {
            diagnosisKey = 'studentStudent';
        } else if (diagnosisType === 'gt') {
            diagnosisKey = 'gamerGamer'; // gt用のキーを追加
        }

        if (diagnosisKey) {
            descriptionElements.forEach(el => {
                const compatType = el.dataset.compatType;
                const partnerType = el.dataset.partnerType;
                const key = [selfType, partnerType].sort().join('_');
                
                if (compatData[diagnosisKey]?.[compatType]?.[key]) {
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

    // シェアボタンが存在し、かつ診断タイプが特定できた場合のみ実行
    if (shareTwitter && shareLine && diagnosisType) {
        const pageUrl = window.location.href;
        const pageTitle = document.title;
        
        let shareIntro = '';
        let hashtag = '';

        switch (diagnosisType) {
            case 'tt':
                shareIntro = '私の教師タイプは';
                hashtag = '#TeacherType16';
                break;
            case 'st':
                shareIntro = '私の生徒タイプは';
                hashtag = '#StudentType16';
                break;
            case 'gt':
                shareIntro = '私のゲーマータイプは';
                hashtag = '#GamerType16';
                break;
        }

        const shareText = `${shareIntro}『${pageTitle}』でした！ あなたも診断してみよう！ ${hashtag}`;
        
        shareTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
        shareLine.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    }
});