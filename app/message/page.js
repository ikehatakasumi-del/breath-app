import Image from "next/image"
export default function Message () {
    return (
        <div className="text-center">
            <p>お疲れ様でした</p>
            <p>APIから取得したメッセージ</p>
            <Image src="/Image/睡蓮.png" alt="睡蓮の花" width={200} height={300}/>
        </div>
    )
};
