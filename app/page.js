import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>
        <h1>Breath</h1>
        <p>メッセージが入る</p>
      </div>
      <Image src="/Image/meditate.png" alt="瞑想する女性" width="600" height="400"/>
      <button>GET STARTED</button>
      <button>:</button>
    </div>
  );
}
