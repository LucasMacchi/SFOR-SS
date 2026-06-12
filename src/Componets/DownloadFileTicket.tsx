"use client"
import { btn_s_style } from "@/utils/styles";


export default function DownloadFileTicket ({url}:{url:string}) {

    return (
        <button style={{...btn_s_style,marginLeft:5,backgroundColor: "#55e455ff"}} onClick={() => window.open(url)}>ABRIR IMAGEN</button>
    )
}