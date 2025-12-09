"use client"
import { IReporte } from "@/utils/interfaces";
import { hr_style, text_2_t_style } from "@/utils/styles";
import { useState } from "react";


export default function ReportesDisplay ({reportes}:{reportes:IReporte[]}) {
    
    const [selectedReporte,setSelectedReporte] = useState(-1)

    return (
        <div>
            <div style={{height: 200,overflow: "scroll"}}>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>CATEGORIA</th>
                            <th style={{border: "1px solid", fontSize: 20}}>FECHA</th>
                        </tr>
                        {reportes.map((d,i) => (
                        <tr onClick={() => setSelectedReporte(i)} key={i}
                        style={{backgroundColor: selectedReporte === i ? "#4A6EE8":"white"}}>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.titulo}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.fecha.toISOString().split("T")[0]}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                {selectedReporte >= 0 && (
                    <div>
                        <h2 style={text_2_t_style}>{reportes[selectedReporte].titulo}</h2>
                        <hr color="#4A6EE8" style={hr_style}/>
                        <p style={{textAlign:"left",whiteSpace:"pre-wrap", maxWidth: 350,textWrap: "wrap",wordWrap: "break-word"}}>{reportes[selectedReporte].descripcion}</p>
                    </div>
                )}
            </div>
        </div>
    )

}