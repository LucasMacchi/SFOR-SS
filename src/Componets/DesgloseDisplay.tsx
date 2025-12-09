"use client"

import { IDesgloseDisplay } from "@/utils/interfaces"
import { text_2_t_style } from "@/utils/styles"
import { useState } from "react"

export default function DesgloseDisplay ({envios}:{envios:IDesgloseDisplay[]}) {

    const [selectedEnvio, setSelectedEnvio] = useState(999)

    return (
        <div style={{display: "flex", justifyContent: "space-evenly", flexGrow: 1}}>
            <div style={{width: 650}}>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 26}}>DEPENDENCIA</th>
                        </tr>
                        {envios.map((e,i) => (
                        <tr style={{backgroundColor: selectedEnvio === i ? "#4A6EE8":"white"}} key={i}
                        onClick={() => setSelectedEnvio(i)}>
                            <th style={{border: "1px solid",fontSize: 20}}>{e.dependencia}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                {selectedEnvio !== 999 ? 
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>INSUMO</th>
                            <th style={{border: "1px solid", fontSize: 20}}>UNIDADES</th>
                            <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                        </tr>
                        {envios[selectedEnvio].detalles.map((d,i) => (
                        <tr key={i}>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.insumo}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.unidades}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                :
                <h2 style={text_2_t_style}>SELECCIONE UN ENVIO PARA VER EL DETALLE</h2>
                }
            </div>
        </div>
    )
}