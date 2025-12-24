"use client"

import { IReparto } from "@/utils/interfaces";
import { btn_small_style, select_style, text_2_s_style } from "@/utils/styles";
import axios from "axios";


export default function PlanSelector ({planes,userPlan,rol,createRepartoFn}:{planes:IReparto[],userPlan: number,rol:number,createRepartoFn:(plan:number,year:number) => Promise<boolean>}) {

    const changePlan = async (newPlan : number) => {
        const res = await axios.patch('/user/plan/api',{repartoId:newPlan})
        if(res.data['success']) {
            window.location.reload()
        }
    }

    const addReparto = async() => {
        const plan = prompt("Ingrese el numero del plan: ")
        const year = prompt("Ingrese el año del plan: ")
        if(plan && year && parseInt(plan) && parseInt(year)) {
            if(confirm(`¿Quieres crear este nuevo plan/reparto? (${plan} - ${year})`)) {
                const parsedPlan = parseInt(plan)
                const parsedYear = parseInt(year)
                const res = await createRepartoFn(parsedPlan,parsedYear)
                if(res){
                    alert("Nuevo Reparto/Plan creado.")
                    window.location.reload()
                }
                else alert("Error al crear reparto.")
            }
        }
    }

    return(
        <div>
            <h2 style={text_2_s_style}>PLAN:</h2>
            <select name="rp_sel" id="rp_sl" value={userPlan}
            onChange={(e) => changePlan(parseInt(e.target.value))}
            style={select_style}>
                {planes.map((p) => (
                    <option key={p.reparto_id} value={p.reparto_id}>{p.numero+"-"+p.periodo}</option>
                ))}
            </select>
            {rol === 1 && <button style={{...btn_small_style,marginLeft: 20}} onClick={() => addReparto()}>+</button>}
        </div>
    )
}