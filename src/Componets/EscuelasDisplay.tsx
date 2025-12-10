"use client"

import { ILentrega } from "@/utils/interfaces";
import { text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";
//@ts-ignore
import "./css/hoverTableCell.css"


export default function EscuelasDisplay ({lugares,departamentos,editFn}:{lugares:ILentrega[],departamentos: string[],
    editFn: (id: number,newVal: string | boolean,column:string,text:boolean) => Promise<boolean>
}) {

    const [selectedDep, setSelectedDep] = useState("")
    const [selectedLgr, setSelectedLgr] = useState(-1)
    const [searchC, setSearchC] = useState("")
    const [filteredLgrs, setFilteredLgrs] = useState<ILentrega[]>(lugares)
    const [up,setUp] = useState(0)

    useEffect(() => {
        setSelectedLgr(-1)
        let arr = lugares
        if(searchC.length > 0) {
            arr = arr.filter(l => l.completo.toLowerCase().includes(searchC.toLowerCase()))
        }
        if(selectedDep.length > 0) {
            arr = arr.filter(l => l.departamento === selectedDep)
        }
        setFilteredLgrs(arr)
    },[searchC,selectedDep])

    const updateArry = (desglose: number, newV: string | number | boolean,column:string) => {
        lugares[selectedLgr].desgloses?.forEach((d) => {
            if(d.desglose_id === desglose) d[column] = newV
        })
        if(filteredLgrs[selectedLgr].desgloses) {
            filteredLgrs[selectedLgr].desgloses.forEach((d) => {
                if(d.desglose_id === desglose) d[column] = newV
            })
        }
        setUp(up+1)
    }

    const editDataBoolean = async (id: number,prev:boolean,column: string) => {
        const newV = !prev
        if(confirm(`¿Quieres cambiar el estado de la columna "${column}"?`)) {
                const res = await editFn(id,newV,column,false)
                if(res) {
                    alert("Se actualizo el desglose exitosamente")
                    updateArry(id,newV,column)
                }
                else alert("Error al actualizar el desglose")
        }
    }

    const editData = async (id: number,prev:string,column: string,num:boolean) => {
        const newData = prompt("Ingrese el nuevo valor: ",prev)
        if(confirm(`¿Quieres cambiar de ${prev} a ${newData} en la columna "${column}"?`)) {
            if(num && typeof newData === "string" && parseInt(newData)) {
                const res = await editFn(id,newData,column,false)
                if(res) {
                    alert("Se actualizo el desglose exitosamente")
                    if(column === "lentrega_id") {
                        window.location.reload()
                    }
                    updateArry(id,newData,column)
                }
                else alert("Error al actualizar el desglose")
            }
            else if(newData) {
                const res = await editFn(id,newData,column,true)
                if(res) {
                    alert("Se actualizo el desglose exitosamente")
                    updateArry(id,newData,column)
                }
                else alert("Error al actualizar el desglose")
            }
            else alert("Valores invalidos")
        }

    }

    return (
        <div style={{marginLeft: 25}}>
            <div style={{ display:"flex"}}>
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
                        <option value={-1}>---</option>
                        {filteredLgrs.map((d,i) => (
                            <option key={i} value={i}>{d.lentrega_id+" - "+d.completo}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{maxHeight: 500,height:500, overflow: "scroll"}}>
                {selectedLgr > -1 && (
                <table style={{width: "90%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "5%"}}>ID ENTREGA</th>
                            <th style={{border: "1px solid", width: "5%"}}>CUE</th>
                            <th style={{border: "1px solid", width: "25%"}}>DEPENDENCIA</th>
                            <th style={{border: "1px solid", width: "5%"}}>RACIONES</th>
                            <th style={{border: "1px solid", width: "5%"}}>TIPO</th>
                            <th style={{border: "1px solid", width: "5%"}}>ENVIADO</th>
                            <th style={{border: "1px solid", width: "5%"}}>VISIBLE</th>
                        </tr>
                        {filteredLgrs[selectedLgr].desgloses ? filteredLgrs[selectedLgr].desgloses.map((d,i) => (
                        <tr key={i}>
                            <th onClick={() => editData(d.desglose_id,d.lentrega_id.toString(),"lentrega_id",true)} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.lentrega_id}</th>
                            <th onClick={() => editData(d.desglose_id,d.cue.toString(),"cue",true)} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.cue}</th>
                            <th onClick={() => editData(d.desglose_id,d.des,"des",false)} id="cnt" style={{border: "1px solid", width: "5%",textAlign: "left"}}>{d.des}</th>
                            <th onClick={() => editData(d.desglose_id,d.raciones.toString(),"raciones",true)} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.raciones}</th>
                            <th style={{border: "1px solid", width: "5%"}}>{d.fortificado ? "ALMUERZO" : "COPA DE LECHE"}</th>
                            <th onClick={() => editDataBoolean(d.desglose_id,d.enviado,"enviado")} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.enviado ? "SI" : "NO"}</th>
                            <th onClick={() => editDataBoolean(d.desglose_id,d.visible,"visible")} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.visible ? "SI" : "NO"}</th>
                        </tr>
                        ))
                    :
                    <h2 style={{...text_2_t_style, marginTop: 40}}>NO HAY DEPENDENCIAS ASOCIADAS AL LUGAR DE ENTREGA</h2>
                    }
                    </tbody>
                </table>
                )}
            </div>
            <div>
            </div>
        </div>
    )
}