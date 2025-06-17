// 必要な調理器具（パッケージ）を読み込む
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Expressアプリを作成（キッチンを建てる）
const app = express();
app.use(express.json()); // JSON形式のリクエストを扱えるようにする

// データベースに接続（冷蔵庫を設置）
const db = new sqlite3.Database('./database.db');

// 最初に一度だけ、データベースにテーブル（棚）を作る
db.serialize(() => {
    // もしtankaテーブルがなければ、新しく作る
    db.run("CREATE TABLE IF NOT EXISTS tanka (id INTEGER PRIMARY KEY, text TEXT, author TEXT, commentary TEXT, likes INTEGER)");

    // データがまだ何もなければ、最初の短歌を一件だけ追加する
    db.get("SELECT COUNT(*) as count FROM tanka", (err, row) => {
        if (row.count === 0) {
            db.run('INSERT INTO tanka (text, author, commentary, likes) VALUES (?, ?, ?, ?)', 
            [
                "I'm still in the reverb. 虹蜥蜴 四肢をちぎって夕陽に透かした",
                "雪道",
                "ナルシスティックな一首ですが、とても大事な歌です。",
                0
            ]);
        }
    });
});

// --- ここからAPI（メニュー表）の作成 ---

// 1. 短歌のデータをください、という注文（GETリクエスト）が来た時の対応
app.get('/api/tanka', (req, res) => {
    db.get("SELECT * FROM tanka WHERE id = 1", (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(row);
        }
    });
});

// 2. いいねを1増やしてください、という注文（POSTリクエスト）が来た時の対応
app.post('/api/like', (req, res) => {
    db.run("UPDATE tanka SET likes = likes + 1 WHERE id = 1", function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Like updated!' });
        }
    });
});


// フロントエンドのファイル（HTML, CSS, JS）を配信する設定
app.use(express.static('.'));

// サーバーを起動する（キッチンを開店する）
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});
