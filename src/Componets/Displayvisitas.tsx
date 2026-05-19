"use client"

import { IVisita } from "@/utils/interfaces"
import { text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"

export default function DisplayVisitas({ visitas, departamentos }: { visitas: IVisita[], departamentos: string[] }) {

    const [selectedDep, setSelectedDep] = useState<string>("")
    const [searchC, setSearchC] = useState<string>("")
    const [filteredVisitas, setFilteredVisitas] = useState<IVisita[]>(visitas)
    const [selectedVisita, setSelectedVisita] = useState<IVisita | null>(null)

    useEffect(() => {
        setSelectedVisita(null)
    },[selectedDep,searchC])

    useEffect(() => {
        let arr = visitas
        if(selectedDep.length > 0) {
            arr = arr.filter(v => v.departamento === selectedDep)
        }
        if(searchC.length > 2) {
            arr = arr.filter(v => v.des.toLowerCase().includes(searchC.toLowerCase()))
        }
        
        setFilteredVisitas(arr)

    },[selectedDep,searchC])
    
    return(
        <div style={{marginLeft: 20,marginBottom:40}}>
            <div >
                <h2 style={text_2_t_style}>RECORRIDOS REALIZADOS</h2>
            </div>
            <div style={{ width: "55%", display:"flex", justifyContent:"space-evenly"}}>
                <div>
                    <h4 style={{...text_2_t_style}}>BUSCAR</h4>
                    <input name="plan-inpt" value={searchC} style={{width: 150}}
                    onChange={(e) => setSearchC(e.target.value)}/>
                </div>
                <div style={{marginBottom: 25}}>
                    <h4 style={{...text_2_t_style}}>DEPARTAMENTO</h4>
                    <select name="estados_sel" id="state_sl"
                        onChange={(e) => setSelectedDep(e.target.value)}>
                        <option value={""}>---</option>
                        {departamentos.map((dep, index) => (
                            <option key={index} value={dep}>
                                {dep}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{height: 350,maxHeight:350,overflow:"scroll"}}>
                <table style={{width: "65%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>ESCUELA</th>
                            <th style={{border: "1px solid", fontSize: 20}}>DEPARTAMENTO</th>
                            <th style={{border: "1px solid", fontSize: 20}}>FECHA VISITA</th>
                        </tr>
                        {filteredVisitas.map((v, i) => (
                            <tr key={i} onClick={() => setSelectedVisita(v)} style={{cursor: "pointer",
                                backgroundColor: selectedVisita?.visita_id === v.visita_id ? "#4A6EE8" : "transparent", 
                                color: selectedVisita?.visita_id === v.visita_id ? "white" : "black"}}>
                                <td style={{border: "1px solid", fontSize: 18}}>{v.des}</td>
                                <td style={{border: "1px solid", fontSize: 18}}>{v.departamento}</td>
                                <td style={{border: "1px solid", fontSize: 18}}>{v.fecha_visitado.toISOString().split('T')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedVisita && (
            <div>
                <h4 style={{...text_2_t_style}}>FORMULARIO DEL RECORRIDO</h4>
                <div style={{height: 350,maxHeight:350,overflow:"scroll"}}>
                    <table style={{width: "65%"}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", fontSize: 20}}>PREGUNTA</th>
                                <th style={{border: "1px solid", fontSize: 20}}>RESPUESTA</th>
                            </tr>
                            {selectedVisita.preguntas.map((v, i) => (
                                <tr key={i} >
                                    <td style={{border: "1px solid", fontSize: 18}}>{v.pregunta}</td>
                                    <td style={{border: "1px solid", fontSize: 18}}>{v.respuesta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            )}
        </div>
    )
}