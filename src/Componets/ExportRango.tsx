"use client"

import exportacionTxt from "@/utils/exportacionTxt"
import { IRemitoNoExportedRQ } from "@/utils/interfaces"
import refillEmptySpace from "@/utils/refillEmptySpace"
import { text_2_t_style } from "@/utils/styles"
import dateParser from "@/utils/txtFunctions.ts/dateParser"
import JSZip from "jszip"
import { CSSProperties, useState } from "react"

const inputPVStyle: CSSProperties = {
    height: 25,
    borderRadius: 4,
    width: 75,
    fontSize: 20
}
const inputRtStyle: CSSProperties = {
    height: 25,
    borderRadius: 4,
    fontSize: 20,
    width: 120
}

export default function ExportRango ({getDataExportFn,exportarRemitos}:{getDataExportFn:(pv:number,start:number,end:number) => Promise<IRemitoNoExportedRQ[]>,
    exportarRemitos:(remito:IRemitoNoExportedRQ[])=>Promise<boolean>
}) {
    const color = "#4A6EE8"
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)
    const [pv, setPv] = useState(8)

    const exportarRangoRts = async () => {
        if(end >= start) {
        if(confirm("¿Quieres exportar los remitos pendientes a exportar?")) {
            const remitos = await getDataExportFn(pv,start,end)
            if(remitos && remitos.length > 0 && confirm("Exportar los remitos los ocultara para la proxima exportacion.")) {
                const res = exportacionTxt(remitos)
                const zip = new JSZip();
                let cabecera = ""
                let items = ""
                res.cabecera.forEach(l => cabecera += l+"\r\n");
                res.items.forEach(l => items += l+"\r\n");

                zip.file('VCABECER.txt',cabecera)
                zip.file('VITEMS.txt',items)

                const dateNow = dateParser(new Date())

                zip.generateAsync({type: 'blob'}).then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = dateNow+'-exportacion-envio.zip';
                    link.click();
                    URL.revokeObjectURL(url);
                })

                const resEnd = await exportarRemitos(remitos)
                if(resEnd) alert("Remitos exportados.")
                else alert("Error al exportar los remitos.")
            } else alert("No hay remitos pendientes.")

        }
        }
    }

    return (
        <div>
            <div style={{display:"flex",justifyContent: "center"}}>
                <h2 style={text_2_t_style}>EXPORTAR POR RANGO DE REMITOS</h2>
            </div>
            <div style={{display:"flex"}}>
                <div style={{display: "flex", alignItems: "center",marginRight:20}}>
                    <h2 style={text_2_t_style}>INICIO:</h2>
                    <input style={inputPVStyle} type="number" value={refillEmptySpace(5,pv)} onChange={(e) => setPv(parseInt(e.target.value))}/>
                    <p>--</p>
                    <input style={inputRtStyle} type="number" value={refillEmptySpace(8,start)} onChange={(e) => setStart(parseInt(e.target.value))}/>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    <h2 style={text_2_t_style}>FINAL:</h2>
                    <input style={inputPVStyle} type="number" value={refillEmptySpace(5,pv)} onChange={(e) => setPv(parseInt(e.target.value))}/>
                    <p>--</p>
                    <input style={inputRtStyle} type="number" value={refillEmptySpace(8,end)} onChange={(e) => setEnd(parseInt(e.target.value))}/>
                </div>
            </div>
            <div style={{display:"flex",justifyContent: "center"}}>
                <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}} onClick={() => exportarRangoRts()}>
                    EXPORTAR REMITOS
                </button>
            </div>
        </div>
    )
}