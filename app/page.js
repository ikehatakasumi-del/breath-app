import Image from "next/image";

export default function Home() {
  return (
    <div className="text-center md:text-2xl lg:text-lg">
      <div>
        <h1 className="font-black p-7 text-4xl">Breath</h1>
        <p className="font-bold">メッセージが入る</p>
      </div>
      <div className="flex justify-center">
        <Image className="" src="/Image/meditate.png" alt="瞑想する女性" width="600" height="400"/>
      </div>
      <div className="font-medium text-white flex flex-col gap-9 items-center">
        <button className="bg-blue-600 p-2 rounded-4xl w-2xs tracking-wider">GET STARTED</button>
        <button className="bg-blue-600 p-2 rounded-4xl w-2xs tracking-wider">MY PROGRESS</button>
        {/* <button className="bg-blue-600 rounded-full w-6">:</button> */}
      </div>
    </div>
  );
}
