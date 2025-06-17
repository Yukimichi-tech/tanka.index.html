// --- HTMLのpタグに、まずクラス名を設定する ---
// これを先に実行することで、後続のquerySelectorが正しく要素を見つけられる
document.querySelectorAll('article p')[0].classList.add('author');
document.querySelectorAll('article p')[2].classList.add('commentary');


// --- HTMLの要素を取得する ---
const likeButton = document.getElementById('likeButton');
const likeCount = document.getElementById('likeCount');
const tankaText = document.querySelector('h2');
const authorText = document.querySelector('.author'); // これで正しく見つかる！
const commentaryText = document.querySelector('.commentary'); // これも正しく見つかる！


// --- 最初にページが読み込まれた時に、サーバーからデータを取得して表示する ---
async function fetchTankaData() {
    const response = await fetch('/api/tanka');
    const data = await response.json();

    // 画面にデータを反映
    tankaText.textContent = data.text;
    authorText.textContent = `作者：${data.author}`;
    commentaryText.textContent = data.commentary;
    likeCount.textContent = data.likes;
}

// --- ボタンがクリックされた時の処理 ---
likeButton.addEventListener('click', async () => {
    // サーバーに「いいね！増やして」と注文
    await fetch('/api/like', { method: 'POST' });

    // 最新のデータを再取得して画面を更新
    fetchTankaData();
});

// 最初に一度、データを取得して表示する
fetchTankaData();
