"use client"

import { IEstados, IUniqRemito } from "@/utils/interfaces";
import { btn_s_style, text_2_t_style } from "@/utils/styles";
import axios from "axios";
import { useState } from "react";


export default function ({remito,estados}:{remito: IUniqRemito,estados: IEstados[]}) {

    const [selectedState, setSelectedState] = useState(0)
    const changeState = async () => {
        if(selectedState && confirm("¿Quieres cambiar el estado?")) {
            let estado = ""
            estados.forEach(s => {
                if(s.estado_id === selectedState) estado = s.des
            });
            const res:boolean = await (await axios.patch('/remitos/uniq/api',{estado_id:selectedState,estado,remito:remito.remito_id})).data["success"]
            if(res) window.location.reload()
            else alert("No se pudo cambiar el estado.")
        }
    }
    return(
        <div>
            {remito.estado !== 'ENTRADA' ? 
            <div>
                <select name="estados_sel" id="state_sl" value={selectedState}
                onChange={(e) => setSelectedState(parseInt(e.target.value))}
                style={{width: 450,fontSize:24}}>
                    <option value={0}>---</option>
                    {estados.map((es) => {
                        if(es.estado_id !== remito.estado_id) {
                            return(
                                <option key={es.estado_id} value={es.estado_id}>{es.des}</option>
                            )
                        }
                    })}
                </select>
                <div style={{marginTop: 15}}>
                    <button style={btn_s_style} onClick={() => changeState()}>CAMBIAR ESTADO</button>
                </div>
            </div>
            :
                <h2 style={{...text_2_t_style, marginTop: 40}}>REMITO EN ENTRADA</h2>
            }

        </div>
    )
}