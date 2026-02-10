
import Link from "next/link"
import Image from "next/image"
export default function Achievements () {
    return (
        <div>
            <Link href="/"
            className="text-3xl"
            >
                top
            </Link>
            <h2 className="text-center text-4xl mt-36">
                {}日達成
            </h2>
            <div className="flex justify-center-safe gap-5">
            <ul className="mt-32 text-2xl" >
                <li>1 月：10日</li>
                <li>2 月：{}</li>
                <li>3 月：{}</li>
                <li>4 月：{}</li>
                <li>5 月：{}</li>
                <li>6 月：{}</li>
            </ul>
            <ul className="mt-32 text-2xl">
                <li>7 月：3日</li>
                <li>8 月：3日</li>
                <li>9 月：{}</li>
                <li>10月：{}</li>
                <li>11月：{}</li>
                <li>12月：{}</li>
            </ul>
            </div>
            <div className="flex justify-center">
                <Image src="/Image/睡蓮.png" alt="睡蓮の花"
                width={200} height={300}
                style={{width:"auto",height:"auto"}}
                priority
                />
            </div>
        </div>
    )
};
