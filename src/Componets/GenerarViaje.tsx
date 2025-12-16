"use client"

import { IAddRemito, IInsumo, IPlan, IViajeRQ } from "@/utils/interfaces"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"


//@ts-ignore
import "./css/hoverTableCell.css"
import parsedPlanToGenerate from "@/utils/parsedPlanToGenerate"

export default function GenenarViaje ({viajes,planes,insumos,generarFn}:{viajes:IViajeRQ[],planes:IPlan[],insumos:IInsumo[],generarFn: (remitos: IAddRemito[])=> Promise<boolean>})  {

    const [selectedViaje,setSelectedViaje] = useState(-1)
    const [selectedRT,setSelectedRT] = useState(-1)

    useEffect(() => {
        setSelectedRT(-1)
    },[selectedViaje])

    const generarEnviosViaje = async () => {
        if(confirm("¿Quieres generar el viaje seleccionado?")) {
            if(viajes[selectedViaje].remitos.length > 0) {
                const remitos = parsedPlanToGenerate(viajes[selectedViaje],planes,insumos)
                const res = await generarFn(remitos)
                if(res) {
                    alert("Remitos creados")
                } else alert("Error al crear los remitos")
            }
            else alert("Viaje no tiene remitos.")
        }
    }

    return (
        <div>
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL PLAN</h2>
                    <select name="estados_sel" id="state_sl" value={selectedViaje}
                    onChange={(e) => setSelectedViaje(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {viajes.map((p,i) => {
                            if(p.remitos.length > 0 && !p.procesado) {
                                return <option key={i} value={i}>{p.des}</option>
                            }
                        })}
                    </select>
                </div>
                <div style={{display:"flex"}}>
                    <div style={{width: "40%"}}>
                        {(selectedViaje > -1 && viajes[selectedViaje].remitos) && (
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>
                                REMITOS DEL VIAJE "{viajes[selectedViaje].des}" - TOTAL {viajes[selectedViaje].remitos.length}
                                </h2>
                                <div style={{maxHeight: 300,height:300,overflow:"scroll"}}>
                                <table style={{width: "100%", fontSize: 16}}>
                                    <tbody>
                                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                                            <th style={{border: "1px solid", width: "80%"}}>CABECERA</th>
                                        </tr>
                                        {viajes[selectedViaje].remitos.map((r,i) => (
                                            <tr key={i} id="cnt" onClick={() => setSelectedRT(i)}>
                                                <th style={{border: "1px solid", width: "80%",textAlign: "left"}}>{r.completo}</th>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{width: "40%"}}>
                        {(selectedViaje > -1 && selectedRT > -1 && viajes[selectedViaje].remitos[selectedRT].detalles) && (
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>
                                DESGLOSES DEL REMITO DEL VIAJE - TOTAL {viajes[selectedViaje].remitos[selectedRT].detalles.length}
                                </h2>
                                <div style={{maxHeight: 300,height:300,overflow:"scroll"}}>
                                <table style={{width: "100%", fontSize: 16}}>
                                    <tbody>
                                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                                            <th style={{border: "1px solid", width: "80%"}}>CABECERA</th>
                                            <th style={{border: "1px solid", width: "20%"}}>RACIONES</th>
                                        </tr>
                                        {viajes[selectedViaje].remitos[selectedRT].detalles.map((r,i) => (
                                            <tr key={i}>
                                                <th style={{border: "1px solid", width: "80%",textAlign: "left"}}>{r.des}</th>
                                                <th style={{border: "1px solid", width: "20%"}}>{r.raciones}</th>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {selectedViaje > -1 && (
                <div style={{display:"flex",justifyContent:"center"}}>
                    <button style={btn_s_style} onClick={() => generarEnviosViaje()}>
                        GENERAR VIAJE
                    </button>
                </div>
                )}
            </div>
        </div>
    )
}