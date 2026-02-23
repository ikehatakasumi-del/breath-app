"use client";
// ⬆️ Next.js App Router では、useStateなどのReactフックを使うファイルに
//    必ず "use client" を書く必要があります

// ========================================
// 必要な機能（フック）をReactからインポートする
// useState  : 「状態（データ）」を管理するフック
// useEffect : 「副作用（タイマーなど）」を管理するフック
// useRef    : 「値をリセットせずに保持する」フック（タイマーIDの保存に使う）
// ========================================
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ========================================
// 定数（変わらない値）をまとめて定義
// ========================================

// 選択できる瞑想時間の一覧
const TIME_OPTIONS = [
  { label: "3分",  minutes: 3  },
  { label: "10分", minutes: 10 },
  { label: "15分", minutes: 15 },
];

// 時間帯によって変わるウェルカムメッセージ
function getWelcomeMessage() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return "おはようございます。今日も一日、深呼吸から始めましょう。";
  if (hour >= 12 && hour < 17) return "こんにちは。少し休憩して、呼吸を整えませんか。";
  if (hour >= 17 && hour < 21) return "お疲れ様です。一日の疲れを呼吸で癒しましょう。";
  return "おやすみ前に、心を落ち着けて深呼吸しましょう。";
}

// ========================================
// メインのコンポーネント（アプリ全体）
// ========================================
export default function BreathApp() {

  // ----------
  // 状態（State）の定義
  // useState(初期値) → [現在の値, 値を変える関数]
  // ----------

  // 今どのページを表示しているか
  // "main"（トップ）/ "meditation"（瞑想）/ "completion"（完了）/ "stats"（実績）
  const [page, setPage] = useState("main");

  // 選択されている瞑想時間（分）
  const [selectedMinutes, setSelectedMinutes] = useState(3);

  // 残り時間（秒）
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // タイマーが動いているか
  const [isRunning, setIsRunning] = useState(false);

  // 呼吸アニメーションの状態: "idle"(初期) / "inhale"(吸う) / "exhale"(吐く)
  const [breathPhase, setBreathPhase] = useState("idle");

  // 完了ボタンを表示するか
  const [showFinish, setShowFinish] = useState(false);

  // アドバイスのテキスト
  const [advice, setAdvice] = useState("読み込み中...");

  // 実績データ（月ごとの回数）
  const [records, setRecords] = useState({});

  // ----------
  // Ref（リセットされない値）の定義
  // ----------

  // setInterval のIDを保存しておく（後でclearIntervalするため）
  const timerRef    = useRef(null);
  const breathRef   = useRef(null);

  // ----------
  // 派生値（stateから計算できる値）
  // ----------

  // 秒 → 「MM:SS」形式に変換
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timerDisplay =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

  // 総実施日数
  const totalDays = Object.keys(records).length;

  // 今年の月別集計
  const currentYear = new Date().getFullYear();
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthKey = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
    return { month: i + 1, count: records[monthKey] || 0 };
  });

  // ----------
  // 副作用（useEffect）
  // ----------

  // ページ読み込み時にlocalStorageから実績を読み込む
  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []); // [] → マウント時に1回だけ実行

  // isRunning が変わるたびにタイマーを開始/停止する
  useEffect(() => {
    if (isRunning) {
      // 1秒ごとに残り時間を減らす
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // 時間切れ
            clearInterval(timerRef.current);
            setIsRunning(false);
            setShowFinish(true);
            stopBreathing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // タイマーを止める
      clearInterval(timerRef.current);
    }

    // クリーンアップ（コンポーネントが消えるときやisRunning変更前に実行）
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // ----------
  // タイマー操作の関数
  // ----------

  // 再生
  function play() {
    // 初回なら時間をセット
    setRemainingSeconds((prev) => (prev === 0 ? selectedMinutes * 60 : prev));
    setIsRunning(true);
    startBreathing();
  }

  // 一時停止
  function pause() {
    setIsRunning(false);
    stopBreathing();
  }

  // 再生/一時停止のトグル
  function playPause() {
    if (isRunning) pause();
    else play();
  }

  // 停止（リセット）
  function stop() {
    setIsRunning(false);
    setRemainingSeconds(0);
    setShowFinish(false);
    stopBreathing();
  }

  // 時間を変更する
  function setTime(minutes) {
    if (isRunning) return; // 再生中は変更不可
    setSelectedMinutes(minutes);
    setRemainingSeconds(0);
    setShowFinish(false);
  }

  // ----------
  // 呼吸アニメーションの関数
  // ----------

  function startBreathing() {
    // すぐに1回実行してから、8秒ごとに繰り返す
    runBreathCycle();
    breathRef.current = setInterval(runBreathCycle, 8000);
  }

  function stopBreathing() {
    clearInterval(breathRef.current);
    setBreathPhase("idle");
  }

  function runBreathCycle() {
    // 吸う（0〜4秒）
    setBreathPhase("inhale");
    // 吐く（4〜8秒）
    setTimeout(() => setBreathPhase("exhale"), 4000);
  }

  // ----------
  // 完了処理
  // ----------

  function finishSession() {
    // 今日の日付（例：2024-01-15）
    const today = new Date().toISOString().split("T")[0];

    // 記録を更新
    setRecords((prev) => {
      const updated = { ...prev };
      const dateKey = today; // "YYYY-MM-DD" をそのままキーにする
      // monthlyは "YYYY-MM" のキーで管理するが、
      // ここでは日付ごとにカウントする（stats側で月集計）
      updated[dateKey] = (updated[dateKey] || 0) + 1;
      localStorage.setItem("records", JSON.stringify(updated));
      return updated;
    });

    stop();
    setPage("completion");
    fetchAdvice();
  }

  // ----------
  // アドバイスをAPIから取得
  // ----------

  async function fetchAdvice() {
    try {
      const res  = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      setAdvice(data.slip.advice);
    } catch {
      setAdvice("Take a moment to appreciate yourself today.");
    }
  }

  // ----------
  // ページ遷移の関数
  // ----------

  function goToMain() {
    stop();
    setPage("main");
  }

  // ========================================
  // レンダリング（画面の描画）
  // ========================================
  return (
    // 画面全体を黒背景にして中央に白いカードを表示
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center font-sans">
      <div className="w-full max-w-sm bg-white min-h-screen relative flex flex-col overflow-hidden">

        {/* ===== メインページ ===== */}
        {page === "main" && (
          <MainPage
            welcomeMessage={getWelcomeMessage()}
            onStart={() => setPage("meditation")}
            onStats={() => setPage("stats")}
          />
        )}

        {/* ===== 瞑想ページ ===== */}
        {page === "meditation" && (
          <MeditationPage
            timerDisplay={timerDisplay}
            isRunning={isRunning}
            breathPhase={breathPhase}
            showFinish={showFinish}
            selectedMinutes={selectedMinutes}
            onPlayPause={playPause}
            onStop={stop}
            onSetTime={setTime}
            onFinish={finishSession}
            onBack={goToMain}
          />
        )}

        {/* ===== 完了ページ ===== */}
        {page === "completion" && (
          <CompletionPage
            advice={advice}
            onBack={goToMain}
          />
        )}

        {/* ===== 実績ページ ===== */}
        {page === "stats" && (
          <StatsPage
            totalDays={totalDays}
            monthlyData={monthlyData}
            onBack={goToMain}
          />
        )}

      </div>
    </div>
  );
}


// ========================================
// 子コンポーネント群
// 各ページを別のコンポーネントとして分けることで
// コードが読みやすくなります
// ========================================

// ----------
// メインページ（トップ画面）
// ----------
function MainPage({ welcomeMessage, onStart, onStats }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between py-12 px-8">

      {/* 右上の3点ボタン（実績ページへ） */}
      <button
        onClick={onStats}
        className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors"
      >
        {/* SVGで「…」を描画 */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5"  cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* タイトル */}
        <h1 className="text-7xl font-black tracking-tight text-stone-800">
          Breath
        </h1>

        {/* ウェルカムメッセージ */}
        <p className="text-center text-stone-500 text-sm leading-relaxed max-w-xs">
          {welcomeMessage}
        </p>

        {/* 瞑想イラスト（SVGで描画） */}
        <MeditationIllustration />
      </div>

      {/* スタートボタン */}
      <button
        onClick={onStart}
        className="w-full bg-stone-800 text-white py-4 rounded-2xl text-base font-bold tracking-widest hover:bg-stone-700 transition-colors"
      >
        GET STARTED
      </button>
    </div>
  );
}

// ----------
// 瞑想ページ（タイマー画面）
// ----------
function MeditationPage({
  timerDisplay, isRunning, breathPhase, showFinish,
  selectedMinutes, onPlayPause, onStop, onSetTime, onFinish, onBack
}) {
  // 呼吸アニメーション用のスタイルを計算
  // breathPhase が "inhale" なら大きく、"exhale" なら小さく
  const circleScale =
    breathPhase === "inhale" ? "scale-150" :
    breathPhase === "exhale" ? "scale-100" : "scale-100";

  const breathMessage =
    breathPhase === "inhale" ? "吸って..." :
    breathPhase === "exhale" ? "吐いて..." : "ゆっくり呼吸しましょう";

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 px-6">

      {/* 戻るボタン */}
      <BackButton onClick={onBack} />

      {/* 呼吸ガイドの円 */}
      <div className="mb-10 flex items-center justify-center" style={{ height: 260 }}>
        <div
          className={`
            rounded-full border-2 border-stone-300 flex items-center justify-center
            transition-transform duration-[4000ms] ease-in-out
            ${circleScale}
          `}
          style={{ width: 200, height: 200 }}
        >
          <p className="text-stone-500 text-sm text-center px-6 leading-relaxed">
            {breathMessage}
          </p>
        </div>
      </div>

      {/* 完了ボタン（時間が0になったら表示） */}
      {showFinish && (
        <button
          onClick={onFinish}
          className="w-full max-w-xs bg-emerald-500 text-white py-3 rounded-full mb-4 font-bold tracking-wider hover:bg-emerald-400 transition-colors"
        >
          FINISH
        </button>
      )}

      {/* タイマー表示 */}
      <div className="bg-stone-100 rounded-2xl px-12 py-4 mb-6">
        <p className="text-4xl font-mono text-stone-800 text-center tabular-nums">
          {timerDisplay}
        </p>
      </div>

      {/* 再生/停止ボタン */}
      <div className="flex gap-4 mb-8">
        {/* 再生/一時停止 */}
        <button
          onClick={onPlayPause}
          className="w-14 h-14 bg-stone-800 rounded-full flex items-center justify-center text-white hover:bg-stone-600 transition-colors"
        >
          {/* isRunning が true なら停止アイコン、false なら再生アイコン */}
          {isRunning ? (
            // ■■ 一時停止アイコン
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6"  y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            // ▶ 再生アイコン
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* 停止（リセット） */}
        <button
          onClick={onStop}
          className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-300 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>
      </div>

      {/* 時間選択ボタン */}
      <div className="flex gap-3">
        {TIME_OPTIONS.map(({ label, minutes }) => (
          <button
            key={minutes}
            onClick={() => onSetTime(minutes)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedMinutes === minutes
                ? "bg-stone-800 text-white"           // 選択中
                : "bg-stone-100 text-stone-600 hover:bg-stone-200" // 未選択
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ----------
// 完了ページ
// ----------
function CompletionPage({ advice, onBack }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between py-12 px-8 bg-gradient-to-b from-white to-stone-50">
      <BackButton onClick={onBack} />

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
        <h1 className="text-3xl font-black text-stone-800">お疲れ様でした</h1>

        <div>
          <p className="text-xs text-stone-400 mb-3 tracking-widest uppercase">Today's Message</p>
          <p className="text-base text-stone-600 leading-relaxed max-w-xs">
            {advice}
          </p>
        </div>

        {/* 蓮の花イラスト */}
        <LotusFlower />
      </div>

      <button
        onClick={onBack}
        className="w-full bg-stone-800 text-white py-4 rounded-2xl text-base font-bold tracking-widest hover:bg-stone-700 transition-colors"
      >
        ホームに戻る
      </button>
    </div>
  );
}

// ----------
// 実績ページ
// ----------
function StatsPage({ totalDays, monthlyData, onBack }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between py-12 px-8">
      <BackButton onClick={onBack} />

      <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
        {/* 継続日数 */}
        <div className="text-center">
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">継続日数</p>
          <p className="text-7xl font-black text-stone-800">
            {totalDays}
            <span className="text-2xl font-normal text-stone-400 ml-2">日</span>
          </p>
        </div>

        {/* 月別記録（2列グリッド） */}
        <div className="w-full grid grid-cols-2 gap-x-12 gap-y-3">
          {monthlyData.map(({ month, count }) => (
            <div key={month} className="flex justify-between items-center border-b border-stone-100 pb-1">
              <span className="text-stone-500 text-sm">{month}月</span>
              <span className="text-stone-800 font-mono text-sm">{count}回</span>
            </div>
          ))}
        </div>

        <LotusFlower />
      </div>
    </div>
  );
}


// ========================================
// 共通の小さなコンポーネント
// ========================================

// 戻るボタン（左上の ← ）
function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-6 left-6 text-stone-400 hover:text-stone-700 transition-colors"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

// 瞑想している人のイラスト
function MeditationIllustration() {
  return (
    <div className="flex justify-center">
    {/* priority(ブラウザがこれは大事な画像だと判断して即座に読み込みを開始する) sizeでブラウザに適切なサイズを伝える */}
      <Image
        src="/Image/aaa.png"
        alt="瞑想する女性"
        width={1200} height={800}
        sizes="(max-width:768px)100vw, 900px"
        className="w-auto max-w-2xl h-auto mb-7"
        priority/>
    </div> 
  );
}

// 蓮の花のイラスト
function LotusFlower() {
  return (
    <div className="flex justify-center">
      <Image
      src="/Image/睡蓮.png"
      alt="睡蓮の花"
      width={1200} height={800}
      sizes="(max-width:768px)100vw, 900px"
      className="w-auto max-w-2xl h-auto mb-7"
      priority/>
    </div>
  );
}