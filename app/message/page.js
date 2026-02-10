"use client";
import Image from "next/image"
import {motion} from "motion/react"
import Link from "next/link";
export default function Message () {
    return (
        <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:1.0,ease:"easeOut"}} className="text-center">
            <Link href="/">top</Link>
            <p className="mt-80 text-3xl">お疲れ様でした</p>
            <p className="mt-12 text-3x">
                APIから取得したメッセージ
            </p>
            <div className="flex justify-center">
                <Image src="/Image/睡蓮.png" alt="睡蓮の花" style={{width:"auto",height:"auto"}} width={200} height={300} priority/>
            </div>
        </motion.div>
    )
};

