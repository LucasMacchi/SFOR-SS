"use client"
import { IPlan } from "@/utils/interfaces";
import { text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";
//@ts-ignore
import "./css/hoverTableCell.css"

export default function PlanesDisplay ({planes,editDaysFn}:{planes: IPlan[],editDaysFn: (detail_id:number,days:number) => Promise<boolean>}) {

    const [selectedP, setSelectedP] = useState(-1)
    const [plan, setPlan] = useState<IPlan>()
    const [up,setUpd] = useState(0)
    useEffect(() => {
        if(selectedP) {
            setPlan(planes[selectedP])
        }
    },[selectedP])

    const changeDays = async (detail_id:number) => {
        const days = prompt("Ingrese la cantidad de dias:")
        if(days && parseInt(days) && detail_id && confirm("¿Quieres modificar la cantidad de dias?")) {
            const res = await editDaysFn(detail_id,parseInt(days))
            if(res) {
                alert("Dias cambiados.")
                plan?.detalles.forEach(d => {
                    if(d.detail_id === detail_id) {
                        d.dias = parseInt(days)
                    }
                });
                setPlan(plan)
                setUpd(up+1)
            }
            else alert("Error al cambiar la cantidad de dias")
        }
    }

    return (
        <div style={{marginLeft: 10}}>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL PLAN</h2>
                <select name="estados_sel" id="state_sl" value={selectedP}
                onChange={(e) => setSelectedP(parseInt(e.target.value))}
                style={{width: 500,fontSize:24,marginBottom: 20}}>
                    <option value={-1}>---</option>
                    {planes.map((p,i) => (
                        <option key={i} value={i}>{p.des+" - "+p.dias+" DIAS"}</option>
                    ))}
                </select>
            </div>
            <div >
                <table style={{width: "70%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "5%"}}>INSUMO</th>
                            <th style={{border: "1px solid", width: "5%"}}>DIAS</th>
                        </tr>
                        {plan?.detalles.map((d) => (
                        <tr key={d.detail_id}>
                            <th style={{border: "1px solid", width: "5%"}}>{d.des}</th>
                            <th onClick={() => changeDays(d.detail_id)} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.dias}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}