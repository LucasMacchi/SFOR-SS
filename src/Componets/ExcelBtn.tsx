"use client"
import excelDownloader from "@/utils/excelDownloader"
import Image from "next/image"


export default function ExcelBtn ({title,disable,data,page,name}:{title:string,disable:boolean,data?: object[],page:string,name:string}) {
    
    const color = disable ? "#778899" : "#32CD32"
    return (
        <div>
            <button disabled={disable} style={{fontSize: 20,backgroundColor: color, borderColor: color, color: "white"}}
            onClick={() => excelDownloader(data,page,name)}>
                <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
                {title}
            </button>
        </div>
    )
}