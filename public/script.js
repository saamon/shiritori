// 単語を管理する配列
const checkWords = [];

// 画面が読み込まれた時に表示される単語集
const randomWords = ["かば", "ねこ", "かさ", "おにぎり", "たまご"];

// 画面が読み込まれたときの処理 (初期化)
// nextWordInputにランダムな単語を表示
window.onload = async (event) => {
  await fetch("/shiritori", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      //randomWords配列からランダムに単語を取得
      previousWord: randomWords[Math.floor(Math.random() * randomWords.length)],
    }),
  });

  //   前の単語を取得
  const response = await fetch("/shiritori");
  const previousWord = await response.text();
  const para = document.querySelector("#previousWord");
  para.innerText = `前の単語：${previousWord}`;
};

// 送信ボタンを押したときの処理
document.querySelector("#nextWordSendButton").onclick = async (event) => {
  const nextWord = document.querySelector("#nextWordInput").value;
  //送信ボタンを押したら入力欄を初期化
  document.querySelector("#nextWordInput").value = "";

  // ひらがな以外の文字が入力された場合はアラートを表示して終了
  if (!nextWord.match(/^[ぁ-ん]+$/)) {
    alert("ひらがなで入力してください");
    return;
  }

  // 配列に単語を追加
  checkWords.push(nextWord);
  //　配列の中身が10個以上になったら、先頭の要素を削除
  if (checkWords.length > 20) {
    checkWords.shift();
  }
  // 配列の中に同じ単語があるかチェック
  for (let i = 0; i < checkWords.length - 1; i++) {
    if (checkWords[i] === nextWord) {
      alert("使われた単語です");
      return;
    }
  }
  // 0文字の場合はアラートを表示する
  if (nextWord.length === 0) {
    alert("単語を入力してください");
    return;
  }

  // 'ん'が最後についている場合はアラートを表示して終了
  if (nextWord.charAt(nextWord.length - 1) === "ん") {
    alert("「ん」で終わる単語は使えません");
    alert("ゲームオーバー！");
    //ゲームオーバーの時は入力欄を初期化
    document.querySelector("#nextWordInput").value = "";
    return;
  }

  const response = await fetch("/shiritori", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nextWord }),
  });

  // エラーがあった場合はアラートを表示して終了
  if (response.status / 100 !== 2) {
    alert(await response.text());
    return;
  }

  // 前の単語を取得
  const previousWord = await response.text();
  const para = document.querySelector("#previousWord");
  para.innerText = `前の単語：${previousWord}`;
};

// historyボタンを押したときの処理
// 配列の中身をdiv#historyに表示
document.querySelector("#historyButton").onclick = async (event) => {
  const para = document.querySelector("#history");
  para.innerText = `単語履歴：${checkWords}`;
};
