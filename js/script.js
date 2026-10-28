/* =========================================================
   ひかりのいろラボ ― 動きをつけるプログラム（script.js）
   ---------------------------------------------------------
   このファイルでは、むずかしいことはしていません。
   やっていることは、ほぼこの3つだけ。

     1. HTMLの部品を id で見つける   → document.getElementById("id名")
     2. 入力された値を読みとる       → 部品.value
     3. 色や文字を書きかえる         → 部品.style.backgroundColor = "色"
                                        部品.textContent = "文字"

   HTMLに書いてある onclick="〇〇()" や oninput="〇〇()" から、
   下にある function（関数）が呼ばれるしくみです。
   ========================================================= */


/* =========================================================
   STEP 1：ライトのON/OFF
   ========================================================= */

// color には 'red' / 'green' / 'blue' のどれかが入ってくる
function toggleLight(color) {
  // 'light-' + 'red' → 'light-red' という id の部品を見つける
  const light = document.getElementById('light-' + color);
  const button = document.getElementById('btn-' + color);

  // classList.toggle('off') は「off がなければつける、あれば外す」
  // CSS の .light.off { opacity: 0; } でライトが消える
  light.classList.toggle('off');
  button.classList.toggle('off');
}


/* =========================================================
   STEP 2：スライダーで色をつくる
   ========================================================= */

// 10進数（0〜255）を、2ケタの16進数（00〜FF）に変える関数
function toHex(number) {
  // toString(16) で16進数の文字にする（例：255 → "ff"）
  // toUpperCase() で大文字にする（例："ff" → "FF"）
  let text = number.toString(16).toUpperCase();

  // 1ケタしかないときは、前に 0 をつけて2ケタにする（例："A" → "0A"）
  if (text.length < 2) {
    text = '0' + text;
  }
  return text;
}

// スライダーが動くたびに呼ばれる関数
function updateMixer() {
  // スライダーの値を読みとる。Number() で「文字」を「数」にする
  const r = Number(document.getElementById('slider-r').value);
  const g = Number(document.getElementById('slider-g').value);
  const b = Number(document.getElementById('slider-b').value);

  // HEXカラーをつくる：# ＋ 赤2ケタ ＋ 緑2ケタ ＋ 青2ケタ
  const hex = '#' + toHex(r) + toHex(g) + toHex(b);

  // スライダー横の数字を書きかえる
  document.getElementById('value-r').textContent = r;
  document.getElementById('value-g').textContent = g;
  document.getElementById('value-b').textContent = b;
  document.getElementById('hex-r').textContent = toHex(r);
  document.getElementById('hex-g').textContent = toHex(g);
  document.getElementById('hex-b').textContent = toHex(b);

  // rgb() の書き方と HEX の書き方、両方を表示する（どちらも同じ色！）
  document.getElementById('rgb-text').textContent = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  document.getElementById('hex-text').textContent = hex;

  // 丸いプレビューの色を変える。まわりに同じ色の光（影）もつける
  const preview = document.getElementById('mixer-preview');
  preview.style.backgroundColor = hex;
  preview.style.boxShadow = '0 0 60px ' + hex;
}


/* =========================================================
   STEP 3：16進数 → 10進数に変換
   ========================================================= */

// 文字が 0〜9 と A〜F だけでできているか調べる関数
// 正しければ true（はい）、ちがう文字があれば false（いいえ）を返す
function isHex(text) {
  const hexChars = '0123456789ABCDEF';

  // 1文字ずつ順番に調べる
  for (let i = 0; i < text.length; i++) {
    if (hexChars.includes(text[i]) === false) {
      return false;
    }
  }
  return true;
}

// 入力欄に文字を打つたびに呼ばれる関数
function convertHex() {
  const text = document.getElementById('hex-input').value.toUpperCase();
  const result = document.getElementById('hex-result');
  const bar = document.getElementById('hex-bar');

  // 空っぽ、または 16進数で使えない文字が入っていたら「?」にする
  if (text === '' || isHex(text) === false) {
    result.textContent = '?';
    bar.style.width = '0%';
    return;
  }

  // parseInt(文字, 16) で、16進数の文字を10進数の数にする（例："FF" → 255）
  const number = parseInt(text, 16);
  result.textContent = number;

  // 255 を 100% として、バーの長さを決める
  bar.style.width = (number / 255 * 100) + '%';
}


/* =========================================================
   STEP 4：穴埋めクイズ
   ========================================================= */

// 問題のリスト。{ } 1つが1問。
// name = お題の名前 / hint = ヒント / answer = 正解のHEX（# はつけない）
// ★ 先生や自分で問題を追加してもOK！
const questions = [
  { name: '赤',          hint: '赤の光だけ全開。緑と青は消灯。',           answer: 'FF0000' },
  { name: '緑',          hint: '緑の光だけ全開。',                         answer: '00FF00' },
  { name: '青',          hint: '青の光だけ全開。',                         answer: '0000FF' },
  { name: '黄',          hint: '赤と緑の光を混ぜると……？',                answer: 'FFFF00' },
  { name: 'シアン（水色）', hint: '緑と青の光を全開に。',                  answer: '00FFFF' },
  { name: 'マゼンタ（赤紫）', hint: '赤と青の光を全開に。',                answer: 'FF00FF' },
  { name: '白',          hint: '3つの光を全部全開にすると……？',          answer: 'FFFFFF' },
  { name: '黒',          hint: '光が1つもない状態。',                       answer: '000000' },
  { name: 'グレー',      hint: '3つの光を全部「半分（80）」に。',          answer: '808080' },
  { name: '暗い赤',      hint: '赤の光を半分（80）だけ。',                  answer: '800000' },
  { name: 'オレンジ',    hint: '赤は全開、緑は半分（80）、青は消灯。',     answer: 'FF8000' }
];

// 今何問目か（0 が1問目）
let current = 0;

// 問題を画面に表示する関数
function showQuestion() {
  const question = questions[current];

  document.getElementById('quiz-number').textContent = (current + 1) + ' / ' + questions.length;
  document.getElementById('quiz-name').textContent = question.name;
  document.getElementById('quiz-hint').textContent = question.hint;
  document.getElementById('quiz-target').style.backgroundColor = '#' + question.answer;

  // 入力欄とメッセージを空にもどす
  document.getElementById('quiz-r').value = '';
  document.getElementById('quiz-g').value = '';
  document.getElementById('quiz-b').value = '';
  document.getElementById('quiz-message').textContent = '';
  updateQuizPreview();
}

// 3つの入力欄の文字をつなげて、6文字のHEXにする関数
function getQuizCode() {
  const r = document.getElementById('quiz-r').value;
  const g = document.getElementById('quiz-g').value;
  const b = document.getElementById('quiz-b').value;
  return (r + g + b).toUpperCase();
}

// 入力するたびに「きみの色」を更新する関数
function updateQuizPreview() {
  const code = getQuizCode();
  const preview = document.getElementById('quiz-preview');

  // 6文字そろっていて、16進数として正しいときだけ色をつける
  if (code.length === 6 && isHex(code)) {
    preview.style.backgroundColor = '#' + code;
    preview.classList.remove('swatch-empty');
  } else {
    preview.style.backgroundColor = '';
    preview.classList.add('swatch-empty');
  }
}

// 「答え合わせ」ボタンで呼ばれる関数
function checkAnswer() {
  const code = getQuizCode();
  const answer = questions[current].answer;
  const message = document.getElementById('quiz-message');

  if (code.length < 6) {
    // まだ全部うまっていない
    message.textContent = '空いているところがあるよ。2ケタずつ入れてね。';
    message.className = 'quiz-message wrong';
  } else if (isHex(code) === false) {
    // 16進数で使えない文字が入っている
    message.textContent = '16進数で使える文字は 0〜9 と A〜F だけだよ。';
    message.className = 'quiz-message wrong';
  } else if (code === answer) {
    // 正解！
    message.textContent = '🎉 せいかい！ #' + answer + ' だね！';
    message.className = 'quiz-message correct';
  } else {
    // まちがい → どの色がちがうか教える
    // substring(0, 2) は「0文字目から2文字目の手前まで」を取り出す
    let text = 'おしい！ ';
    if (code.substring(0, 2) !== answer.substring(0, 2)) {
      text = text + '赤(RR) ';
    }
    if (code.substring(2, 4) !== answer.substring(2, 4)) {
      text = text + '緑(GG) ';
    }
    if (code.substring(4, 6) !== answer.substring(4, 6)) {
      text = text + '青(BB) ';
    }
    message.textContent = text + 'を見直してみよう。';
    message.className = 'quiz-message wrong';
  }
}

// 「次の問題」ボタンで呼ばれる関数
function nextQuestion() {
  current = current + 1;

  // 最後の問題の次は、1問目にもどる
  if (current >= questions.length) {
    current = 0;
  }
  showQuestion();
}


/* =========================================================
   ページを開いたときに1回だけ実行する
   ========================================================= */
updateMixer();
showQuestion();
