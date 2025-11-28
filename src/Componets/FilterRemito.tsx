"use client"

import {btn_small_style, select_style, text_2_s_style } from "@/utils/styles";
import { CSSProperties, useEffect, useState } from "react";
import { IEstados, IRemitosEnvio } from "@/utils/interfaces";
import { useRouter } from "next/navigation"
import refillEmptySpace from "@/utils/refillEmptySpace";


export default function FilterRemito ({remitos,estados}:{remitos: IRemitosEnvio[],estados:IEstados[]}) {
    const router = useRouter()
    const [selectedState, setSelectedState] = useState(0)
    const [selectedFac, setSelectedFac] = useState(0)
    const [filterRemitos, setFilterRemitos] = useState<IRemitosEnvio[]>(remitos)
    const marginBwtFilters = 20

    const colorChange = (state: string) => {
        if(state === "PENDIENTE") {
            return "gold"
        }
        else if(state === "PREPARADO") {
            return "lightgreen"
        }
        else if(state === "DESPACHADO") {
            return "Tan"
        }
        else if(state === "ENTREGADO") {
            return "Lime"
        }
        else if(state === "EXTRAVIADO" || state === "DEVOLUCION") {
            return "Tomato"
        }
        else if(state === "ENTRADA"){
            return "Orange"
        } 
    }

    const searchContainerStyle: CSSProperties = {
        backgroundColor: "#4A6EE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: 4,
        marginTop: 20,
        padding: 15,
    }

    useEffect(() => {
        let arr = remitos
        if(selectedState) arr = arr.filter((rt) => rt.estado_id === selectedState)
        if(selectedFac === 1) arr = arr.filter((rt) => rt.numf)
        if(selectedFac === 2) arr = arr.filter((rt) => !rt.numf)
        setFilterRemitos(arr)
    },[selectedState,selectedFac])

    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }

    return(
        <div style={{width: "85%"}}>
            <div style={searchContainerStyle}>
                <div style={{display: "flex",justifyContent: "space-evenly"}}>
                    <div style={{margin: marginBwtFilters}}>
                        <h4 style={text_2_s_style}>ESTADO</h4>
                        <select name="estados_sel" id="state_sl" value={selectedState}
                        onChange={(e) => setSelectedState(parseInt(e.target.value))}
                        style={select_style}>
                            <option value={0}>---</option>
                            {estados.map((es) => (
                                <option key={es.estado_id} value={es.estado_id}>{es.des}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{margin: marginBwtFilters}}>
                        <h4 style={text_2_s_style}>FACTURADO</h4>
                        <select name="fac_sel" id="fc_sl" value={selectedFac}
                        onChange={(e) => setSelectedFac(parseInt(e.target.value))}
                        style={select_style}>
                            <option value={0}>---</option>
                            <option value={1}>SI</option>
                            <option value={2}>NO</option>
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", width: "20%"}}>REMITO</th>
                            <th style={{border: "1px solid", width: "20%"}}>LOCALIDAD</th>
                            <th style={{border: "1px solid", width: "20%"}}>DEPART.</th>
                            <th style={{border: "1px solid", width: "20%"}}>ESTADO</th>
                            <th style={{border: "1px solid", width: "8%"}}>REP.</th>
                            <th style={{border: "1px solid", width: "8%"}}>FAC.</th>
                            <th style={{border: "1px solid", width: "8%"}}>TIPO</th>
                        </tr>
                        {filterRemitos.map((rt) => (
                        <tr style={{backgroundColor: colorChange(rt.estado)}} key={rt.remito_id}
                        onClick={() => router.push("/inicio/"+rt.remito_id)}>
                            <th style={{border: "1px solid", width: "20%"}}>{parseRemitoToString(rt.pv,rt.numero)}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.localidad}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.departamento}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.estado}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.reportes}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.numf ? "SI" : "NO"}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.fortificado ? "AL" : "CL"}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}