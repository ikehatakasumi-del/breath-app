import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center md:text-2xl lg:text-lg">
      <div>
        <h1 className="font-extrabold p-12 mt-8 tracking-wide text-6xl">Breath</h1>
        <p className="font-light">メッセージが入る</p>
      </div>
      <div className="flex justify-center">
        {/* priority(ブラウザがこれは大事な画像だと判断して即座に読み込みを開始する) sizeでブラウザに適切なサイズを伝える classNameでのサイズは*/}
        <Image
        src="/Image/aaa.png"
        alt="瞑想する女性"
        width={1200} height={800}
        sizes="(max-width:768px)100vw, 900px"
        className="w-full max-w-2xl h-auto mb-7"
        priority/>
      </div>
      <div className="font-medium text-white flex flex-col gap-9 items-center">
        <Link href="/acievements"
        className="bg-blue-600 p-4 rounded-4xl w-2xs tracking-wider cursor-pointer focus:ring-5 focus:ring-blue-300"
        >
          GET STARTED
        </Link>
        {/* Linkタグは別の場所に連れて行ってくれるドア　
        Buttonは何かを実行するスイッチ（送信や保存など）
        Buttonの中にLinkを書くとパソコンが混乱する → Linkを使いCSSで見た目をボタンぽくする*/}
        <Link href="/acievements"
        className="bg-blue-600 p-4 rounded-4xl w-2xs tracking-wider cursor-pointer focus:ring-5 focus:ring-blue-300"
        >
          MY PROGRESS
        </Link>
      </div>
    </div>
  );
}
