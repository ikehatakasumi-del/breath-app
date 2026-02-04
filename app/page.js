import Image from "next/image";

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
        <button
        className="bg-blue-600 p-4 rounded-4xl w-2xs tracking-wider"
        >
          GET STARTED
        </button>
        <button
        className="bg-blue-600 p-4 rounded-4xl w-2xs tracking-wider"
        >
          MY PROGRESS
        </button>
      </div>
    </div>
  );
}
