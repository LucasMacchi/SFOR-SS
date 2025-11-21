"use client"

import {btn_small_style, select_style, text_2_s_style } from "@/utils/styles";
import { ESTADOS } from "@/utils/enums";
import { CSSProperties, useState } from "react";
import { IRemitosEnvio } from "@/utils/interfaces";

export default function FilterRemito ({remitos}:{remitos: IRemitosEnvio[]}) {
    const [selectedState, setSelectedState] = useState("")
    const [selectedFac, setSelectedFac] = useState(0)
    const marginBwtFilters = 20

    const searchContainerStyle: CSSProperties = {
        backgroundColor: "#4A6EE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: 4,
        marginTop: 20,
        padding: 15,
    }

    return(
        <div style={{width: "85%"}}>
            <div style={searchContainerStyle}>
                <div style={{display: "flex",justifyContent: "space-evenly"}}>
                    <div style={{margin: marginBwtFilters}}>
                        <h4 style={text_2_s_style}>ESTADO</h4>
                        <select name="estados_sel" id="state_sl" value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        style={select_style}>
                            <option value={""}>---</option>
                            {Object.values(ESTADOS).map((st) => (
                                <option value={st}>{st}</option>
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
                    <div style={{alignContent: "center"}}>
                        <button style={btn_small_style}>FILTRAR</button>
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
                        {remitos.map((rt) => (
                        <tr>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.nro_remito}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.localidad}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.departamento}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.estado}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.reportes}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.factura ? "SI" : "NO"}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.fortificado ? "AL" : "CL"}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}