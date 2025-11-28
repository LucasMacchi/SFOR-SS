"use client"

import { IReparto } from "@/utils/interfaces";
import { select_style, text_2_s_style } from "@/utils/styles";
import axios from "axios";


export default function PlanSelector ({planes,userPlan}:{planes:IReparto[],userPlan: number}) {

    const changePlan = async (newPlan : number) => {
        const res = await axios.patch('/user/plan/api',{repartoId:newPlan})
        if(res.data['success']) {
            window.location.reload()
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
        </div>
    )
}