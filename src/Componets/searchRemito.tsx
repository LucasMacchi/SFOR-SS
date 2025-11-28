"use client"
import refillEmptySpace from "@/utils/refillEmptySpace";
import { CSSProperties, useState } from "react";
import TitleComponent from "./TitleComponent";
import { btn_small_style } from "@/utils/styles";
import axios from "axios";
import { useRouter } from "next/navigation"


export default function SearchRemito () {
    const inputPVStyle: CSSProperties = {
        height: 25,
        borderRadius: 4,
        width: 75,
        fontSize: 20
    }

    const searchContainerStyle: CSSProperties = {
        backgroundColor: "#4A6EE8",
        display: "flex",
        alignItems: "center",
        width: "65%",
        justifyContent: "space-evenly",
        borderRadius: 4,
    }
    const inputRtStyle: CSSProperties = {
        height: 25,
        borderRadius: 4,
        fontSize: 20,
        width: 120
    }
    const router = useRouter()
    const [pv, setPv] = useState(0)
    const [rt, setRt] = useState(0)

    const searchRemito = async () => {
        if(pv && rt) {
            const remito = pv+"-"+rt
            const res:boolean | number = await (await axios.post('/remitos/uniq/api',{pv,numero:rt})).data["check"]
            if(res) {
                router.push("/inicio/"+res)
            }
            else alert("Remito no existe.")
        }
    }

    return(
        <div style={searchContainerStyle}>
            <TitleComponent txt="BUSCAR REMITO:" secondary={false}/>
            <div style={{display: "flex", alignItems: "center"}}>
                <input style={inputPVStyle} type="number" value={refillEmptySpace(5,pv)} onChange={(e) => setPv(parseInt(e.target.value))}/>
                <p>--</p>
                <input style={inputRtStyle} type="number" value={refillEmptySpace(8,rt)} onChange={(e) => setRt(parseInt(e.target.value))}/>
            </div>
            <div>
                <button style={btn_small_style} onClick={() => searchRemito()}>CONSULTAR</button>
            </div>
        </div>
    )
}