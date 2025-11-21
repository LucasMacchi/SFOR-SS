"use client"
import refillEmptySpace from "@/utils/refillEmptySpace";
import { CSSProperties, useState } from "react";
import TitleComponent from "./TitleComponent";
import { btn_small_style } from "@/utils/styles";


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

    const [pv, setPv] = useState("")
    const [rt, setRt] = useState("")

    return(
        <div style={searchContainerStyle}>
            <TitleComponent txt="BUSCAR REMITO:" secondary={false}/>
            <div style={{display: "flex", alignItems: "center"}}>
                <input style={inputPVStyle} type="number" value={pv} onChange={(e) => setPv(refillEmptySpace(5,parseInt(e.target.value)))}/>
                <p>--</p>
                <input style={inputRtStyle} type="number" value={rt} onChange={(e) => setRt(refillEmptySpace(8,parseInt(e.target.value)))}/>
            </div>
            <div>
                <button style={btn_small_style}>CONSULTAR</button>
            </div>
        </div>
    )
}