"use client"
import { IDesglose, IHistorialDesglose } from "@/utils/interfaces";
import { btn_s_style, text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";


export default function HistorialDesglose ({desgloses, historialFn}:{desgloses: IDesglose[], historialFn: (desglose_id: number) => Promise<IHistorialDesglose[]>}) {

    const [selectedLgr, setSelectedLgr] = useState<IDesglose | null>(null)
    const [searchC, setSearchC] = useState("")
    const [filteredDesgloses, setFilteredDeslgloses] = useState(desgloses)
    const [historial, setHistorial] = useState<IHistorialDesglose[]>([])

    useEffect(() => {
        setSelectedLgr(null)
        let arr = desgloses
        if(searchC.length > 0) {
            arr = arr.filter(d => d.des.toLowerCase().includes(searchC.toLowerCase()))
        }
        setFilteredDeslgloses(arr)
    },[searchC])

    const getHistorial = async () => {
        if(selectedLgr){
            const historialData = await historialFn(selectedLgr.desglose_id)
            setHistorial(historialData)
        }
    }
    
    return(
        <div style={{marginLeft: 20,marginBottom: 100}}>
            <div style={{ display:"flex"}}>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>BUSCAR</h2>
                    <input name="plan-inpt" value={searchC} style={{width: 250,fontSize:16,marginBottom: 20}}
                    onChange={(e) => setSearchC(e.target.value)}/>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>LUGARES DE ENTREGA - {filteredDesgloses.length}</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => setSelectedLgr(filteredDesgloses[parseInt(e.target.value)])}
                    style={{width: 800,fontSize:16,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {filteredDesgloses.map((d,i) => (
                            <option key={i} value={i}>{d.cue} - {d.des} - {d.fortificado ? "AL" : "CL"}</option>
                        ))}
                    </select>
                </div>
                <div style={{display: "flex", alignItems: "center", marginLeft: 10}}>
                    <button style={{...btn_s_style}} onClick={() => getHistorial()}>BUSCAR</button>
                </div>
                
            </div>
            <div>
                {historial.length > 0 && (
                <table style={{width: "85%"}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "8%"}}>PV</th>
                            <th style={{border: "1px solid", width: "8%"}}>NRO</th>
                            <th style={{border: "1px solid", width: "8%"}}>FECHA ENTREGADO</th>
                            <th style={{border: "1px solid", width: "8%"}}>VIAJE</th>
                            <th style={{border: "1px solid", width: "8%"}}>PLAN</th>
                        </tr>
                        {historial && historial.map((h,i) => (
                            <tr key={i}>
                                <td style={{border: "1px solid"}}>{h.pv}</td>
                                <td style={{border: "1px solid"}}>{h.numero}</td>
                                <td style={{border: "1px solid"}}>{h.fecha_entregado ? h.fecha_entregado.toISOString().split('T')[0] : "N/A"}</td>
                                <td style={{border: "1px solid"}}>{h.viaje ? h.viaje : "N/A"}</td>
                                <td style={{border: "1px solid"}}>{h.plan + " "+ h.periodo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    )
}