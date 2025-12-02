"use client"

import { IFacturaAgrupado } from "@/utils/interfaces"
import { text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"
import refillEmptySpace from "@/utils/refillEmptySpace";


export default function FacturasDisplay ({facturas}:{facturas:IFacturaAgrupado[]}) {
    
    const [selectedF, setSelectedF] = useState(0)
    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }
    //ARREGLAR ESTO
    useEffect(() => console.log(selectedF),[selectedF])
    return (
        <div style={{marginBottom: 50}}>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA LA FACTURA</h2>
                <select name="estados_sel" id="state_sl" value={selectedF}
                onChange={(e) => setSelectedF(parseInt(e.target.value))}
                style={{width: 450,fontSize:24,marginBottom: 20}}>
                    <option value={-1}>---</option>
                    {facturas.map((f,i) => (
                        <option key={i} value={i}>{parseRemitoToString(f.pv,f.numero)}</option>
                    ))}
                </select>
            </div>
            <div style={{height: 450,overflow: "scroll"}}>
                {selectedF > -1 && facturas[selectedF].remitos ? 
                <table style={{width: "100%", maxHeight: 400}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>REMITO</th>
                            <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                        </tr>
                        {facturas[selectedF].remitos.map((d,i) => (
                        <tr key={i}>
                            <th style={{border: "1px solid", fontSize: 20}}>{parseRemitoToString(d.pv,d.numero)}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                :
                <h2 style={text_2_t_style}>SELECCIONE UNA FACTURA PARA VER EL DETALLE</h2>
                }
            </div>
            {selectedF > -1 && <h2 style={text_2_t_style}>TOTAL DE REMITOS: {facturas[selectedF].remitos?.length}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>SUMA TOTAL DE RACIONES: {facturas[selectedF].raciones}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>FECHA DE FACTURA: {facturas[selectedF].fecha_factura.toISOString().split("T")[0]}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>ESTADO: {facturas[selectedF].cerrado ? "CERRADA" : "ABIERTA"}</h2>}
        </div>
    )
}