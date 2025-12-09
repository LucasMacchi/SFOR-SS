"use client"

import { ILentrega } from "@/utils/interfaces";
import { text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";



export default function EscuelasDisplay ({lugares,departamentos}:{lugares:ILentrega[],departamentos: string[]}) {

    const [selectedDep, setSelectedDep] = useState("")
    const [selectedLgr, setSelectedLgr] = useState(0)
    const [searchC, setSearchC] = useState("")
    const [filteredLgrs, setFilteredLgrs] = useState<ILentrega[]>(lugares)

    useEffect(() => {
        let arr = lugares
        if(searchC.length > 0) {
            arr = arr.filter(l => l.completo.toLowerCase().includes(searchC.toLowerCase()))
        }
        if(selectedDep.length > 0) {
            arr = arr.filter(l => l.departamento === selectedDep)
        }
        setFilteredLgrs(arr)
    },[searchC,selectedDep])

    return (
        <div>
            <div style={{marginLeft: 10, display:"flex"}}>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>BUSCAR</h2>
                    <input name="plan-inpt" value={searchC} style={{width: 250,fontSize:16,marginBottom: 20}}
                    onChange={(e) => setSearchC(e.target.value)}/>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>DEPARTAMENTO</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => setSelectedDep(e.target.value)}
                    style={{width: 300,fontSize:16,marginBottom: 20}}>
                        <option value={""}>---</option>
                        {departamentos.map((d,i) => (
                            <option key={i} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>LUGARES DE ENTREGA - {filteredLgrs.length}</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => setSelectedLgr(parseInt(e.target.value))}
                    style={{width: 800,fontSize:16,marginBottom: 20}}>
                        {filteredLgrs.map((d,i) => (
                            <option key={i} value={i}>{d.lentrega_id+" - "+d.completo}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}