"use client";
import { useEffect, useState } from "react"

export default function Keisan(){
    //日付の配列　例："2026-02-10"
    const [achievements,setAchievements] = useState([]);
    //現在表示している月　初期値は現在の月
    const [selectedMonth,setSelectedMonth] = useState(new Date("").getMonth);
    //表示している年　初期値は今年
    const [selectedYear] = useState(new Date().getFullYear());

    //-----①データの読み込み
    useEffect(() => {
        //LocalStorageから"achievements"という名前のデータを取り出す
        const saved = localStorage.getItem("achievements");
        //もしデータがあったら
        if(saved){
            //文字列として保存されているデータを配列に戻してセットする。
            setAchievements(JSON.parse(saved));
        }
    },[]); //初回マウント時にだけ実行

    //-----②データの保存（中身が変わるたびに）
    useEffect(() => {
        //保存場所"achievements"に、配列を文字に変換し保存
        localStorage.setItem("achievements",JSON.stringify(achievements));
    },[achievements]);

    /*================
    *　機能を動かす関数
    *================*/

    //-----新しい達成日を追加する
    const addAchievement = () => {
        //今日という日付を"YY-MM-DD"という形で取得
        const today = new Date().toISOString().split("T")[0];
        //まだ今日の日付が記録されていなければ追加する（重複防止のため）
        if (!achievements.includes(today)){
            //今までのデータに今日を足して、日付順に並び替えて保存
            setAchievements([...achievements,today].sort());
        }
    };

    //-----指定した日付を削除する
    const removeAchievement = (date) => {
        //削除したい日付以外のデータだけ残して新しくセットする。
        setAchievements(achievements.filter(d => d!==date));
    };

    //-----選択されている「月」と「年」に一致するデータだけを抽出する
    const getMonthAchievements = () => {
        return achievements.filter(date => {
            const d = new Date(date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
    };

    //-----今年の全達成日数を合計する
    const getYearTotal = () => {
        return achievements.filter(date => {
            const d = new Date(date);
            return d.getFullYear() === selectedYear;
        }).length;//条件に合ったデータの数を返す
    };

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>達成記録</h1>

      {/* 記録ボタン */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={addAchievement}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          今日の達成を記録
        </button>
      </div>

      {/* 年間の合計表示 */}
      <div style={{ textAlign: 'center', marginBottom: '30px', fontSize: '20px', fontWeight: 'bold' }}>
        {selectedYear}年の達成日数: {getYearTotal()}日
      </div>

      {/* 月を選択するセレクトボックス */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>月を選択:</label>
        <select
          value={selectedMonth}
          // 選択が変わったら selectedMonth の数字を更新する
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index}>{name}</option>
          ))}
        </select>
      </div>

      {/* 選択した月の達成リスト */}
      <h2>{monthNames[selectedMonth]}の達成日</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '15px' }}>
        {getMonthAchievements().length === 0 ? (
          <p style={{ color: '#999' }}>まだ達成日がありません</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {/* 抽出した月ごとのデータを1つずつ <li> として表示 */}
            {getMonthAchievements().map(date => (
              <li
                key={date}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* 日付を日本向けの見やすい形式（例: 2023/10/01）で表示 */}
                <span>{new Date(date).toLocaleDateString('ja-JP')}</span>
                <button
                  onClick={() => removeAchievement(date)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
        </div>
    )
}
