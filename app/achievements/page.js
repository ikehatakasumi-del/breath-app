import Link from "next/link"
import Image from "next/image"
export default function Achievements () {
    return (
        <div>
            <Link href="/"
            className=""
            >
                top
            </Link>
            <h2 className="text-center text-4xl mt-36">
                {}日達成
            </h2>
            <ul className="mt-32 text-2xl">
                <li>1月：{}</li>
                <li>2月：{}</li>
                <li>3月：{}</li>
                <li>4月：{}</li>
                <li>5月：{}</li>
                <li>6月：{}</li>
                <li>7月：{}</li>
                <li>8月：{}</li>
                <li>9月：{}</li>
                <li>10月：{}</li>
                <li>11月：{}</li>
                <li>12月：{}</li>
            </ul>
            {/* <Image src=""/> */}
        </div>
    )
};
