"use client"
import { saveAs } from "file-saver"
import Image from "next/image"


export default function PdfBtn ({title,disable,pdf}:{title:string,disable:boolean,pdf:Promise<Blob>}) {
    
    const color = disable ? "#778899" : "#FF6347"
    const downloadBlob = async () => {
        saveAs(await pdf,title)
    }
    return (
        <div>
            <button disabled={disable} style={{fontSize: 20,backgroundColor: color, borderColor: color, color: "white"}}
            onClick={() => downloadBlob()}>
                <Image src={"/pdfLogo-2.png"} alt="logo de pdf" width={25} height={25} style={{alignSelf:"baseline"}}/>
                {title}
                </button>
        </div>
    )
}