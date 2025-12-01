"use client"
import { IReporteCategoria } from "@/utils/interfaces";
import { btn_s_style, text_2_t_style } from "@/utils/styles";
import { useState } from "react";

export default function ReporteAdd ({categorias}:{categorias:IReporteCategoria[]}) {

    const [selectedCat, setSelectedCat] = useState(0)
    const [descripcion, setDescripcion] = useState("")

    const createReporte = () => {
        
    }
    return(
        <div>
            <div>
                <h2 style={text_2_t_style}>Crear Reporte</h2>
                <h3 style={text_2_t_style}>Seleccione la categoria:</h3>
                <div>
                    <select name="estados_sel" id="state_sl" value={selectedCat}
                    onChange={(e) => setSelectedCat(parseInt(e.target.value))}
                    style={{width: 450,fontSize:24}}>
                        <option value={0}>---</option>
                        {categorias.map((c) => (
                            <option key={c.categoria_id} value={c.categoria_id}>{c.des}</option>
                        ))}
                    </select>
                </div>
                <h3 style={text_2_t_style}>Describa el reporte:</h3>
                <textarea style={{height: 150,width: "60%",resize: "none"}} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
                <div style={{marginTop: 15}}>
                    <button style={btn_s_style} onClick={() => createReporte()}>CREAR REPORTE</button>
                </div>
            </div>
        </div>
    )
}