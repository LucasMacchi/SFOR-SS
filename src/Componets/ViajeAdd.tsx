"use client"

import { IDesglose, ILentrega, IPlan, IViajeDetalle, IViajeRemito } from "@/utils/interfaces"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"
//@ts-ignore
import "./css/hoverTableCell.css"

export default function ViajeAdd ({escuelas,departamentos,planes} : {escuelas: ILentrega[],departamentos:string[],planes:IPlan[]}) {

    const [selectedDep, setSelectedDep] = useState("")
    const [selectedLgr, setSelectedLgr] = useState(-1)
    const [filteredLgrs, setFilteredLgrs] = useState<ILentrega[]>(escuelas)
    const [viajeDes, setViajeDes] = useState("")
    const [selectedP, setSelectedP] = useState(-1)
    const [desgloses,setDesgloses] = useState<IDesglose[]>([])
    const [detallesViaje,setDetallesViaje] = useState<IDesglose[]>([])
    const [updater,setUpdater] = useState(0)
    const [remitos, setRemitos] = useState<IViajeRemito[]>([])
    const maxheight = 350
    useEffect(() => {
        setSelectedLgr(-1)
        let arr = escuelas
        if(selectedDep.length > 0) {
            arr = arr.filter(l => l.departamento === selectedDep)
        }
        setFilteredLgrs(arr)
    },[selectedDep])

    useEffect(() => {
        setDetallesViaje([])
        setSelectedDep("")
        setSelectedLgr(-1)
        setDesgloses([])
    },[selectedP])

    useEffect(() => {
        setDesgloses([])
        if(selectedLgr > -1 && filteredLgrs[selectedLgr].desgloses) setDesgloses(filteredLgrs[selectedLgr].desgloses)
    },[selectedLgr])

    const addDesglose = (desglo:IDesglose) => {
        setDetallesViaje(prev => [...prev,desglo])
    }
    const delRt = (index:number) => {
        const arr = detallesViaje
        arr.splice(index,1)
        setDetallesViaje([...arr])
        setUpdater(updater + 1)
    }
    const delRtet = (index:number) => {
        const arr = remitos
        arr.splice(index,1)
        setRemitos([...arr])
        setUpdater(updater + 1)
    }

    const checkDesglose = (id:number) => {
        return detallesViaje.find((des) => des.desglose_id === id)
    }
    const checkDesgloseRemitos = (id:number) => {
        let check = false
        remitos.forEach(r => {
            r.detalles.forEach(d => {
                if(d.desglose_id === id) check = true
            });
        });
        return check
    }

    const planReturner = (id:number) : string => {
        let des = ""
        planes.forEach(p => {
            if(p.plan_id === id) des = p.des+" x "+p.dias
        });
        return des
    }

    const createRemito = () => {
        const detalle:IViajeDetalle[] = []
        detallesViaje.forEach(d => {
            detalle.push({
                desglose_id: d.desglose_id,
                raciones: d.raciones
            })
        });
        const remito: IViajeRemito = {
            plan_id: planes[selectedP].plan_id,
            lenterga_id: escuelas[selectedLgr].lentrega_id,
            detalles: detalle
        }
        setRemitos([...remitos, remito])
        setDetallesViaje([])
        setDesgloses([])
        setSelectedLgr(-1)
        setSelectedDep("")
        setUpdater(updater + 1)
    }
    return (
        <div style={{marginLeft: 25, marginBottom: 100}}>
            <div style={{display: "flex",marginLeft: 10}}>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>DESCRIPCION</h2>
                    <input name="plan-inpt" value={viajeDes} style={{width: 250,fontSize:24,marginBottom: 20}}
                    onChange={(e) => setViajeDes(e.target.value)}/>
                </div>
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
            </div>
            <div style={{display: "flex"}}>
                <div style={{marginLeft: 10}}> 
                    <h2 style={{...text_2_t_style, marginTop: 40}}>DEPARTAMENTO</h2>
                    <select name="estados_sel" id="state_sl" disabled={!(selectedP > -1)}
                    onChange={(e) => setSelectedDep(e.target.value)} value={selectedDep}
                    style={{width: 300,fontSize:16,marginBottom: 20}}>
                        <option value={""}>---</option>
                        {departamentos.map((d,i) => (
                            <option key={i} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>LUGARES DE ENTREGA - {filteredLgrs.length}</h2>
                    <select name="estados_sel" id="state_sl" disabled={!(selectedP > -1)}
                    onChange={(e) => setSelectedLgr(parseInt(e.target.value))} value={selectedLgr}
                    style={{width: 800,fontSize:16,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {filteredLgrs.map((d,i) => {
                            if(d.desgloses && d.desgloses.length > 0) {
                                return <option key={i} value={i}>{d.lentrega_id+" - "+d.completo}</option>
                            }
                        })}
                    </select>
                </div>
            </div>
            <div style={{display: "flex",width: "100%",justifyContent:"start"}}>
                <div >
                    <h2 style={{...text_2_t_style, marginTop: 40}}>ELIGE EL DESGLOSE</h2>
                    <div style={{maxHeight: maxheight,height:maxheight, overflow: "scroll", width: 500}}>
                    {desgloses.length > -1 && (
                    <table style={{width: "100%", fontSize: 16}}>
                        <tbody>
                            <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                                <th style={{border: "1px solid", width: "80%"}}>DEPENDENCIA</th>
                                <th style={{border: "1px solid", width: "5%"}}>RACIONES</th>
                                <th style={{border: "1px solid", width: "5%"}}>TIPO</th>
                            </tr>
                            {desgloses.map((d,i) => {
                                if(selectedP > -1 && d.fortificado === planes[selectedP].fortificado && !checkDesglose(d.desglose_id) && !checkDesgloseRemitos(d.desglose_id)) {
                                    return (
                                    <tr key={i} onClick={() => addDesglose(d)} id="cnt">
                                        <th style={{border: "1px solid", width: "80%",textAlign: "left"}}>{d.des}</th>
                                        <th style={{border: "1px solid", width: "5%"}}>{d.raciones}</th>
                                        <th style={{border: "1px solid", width: "5%"}}>{d.fortificado ? "AL" : "CL"}</th>
                                    </tr>
                                    )
                                }
                            })
                        }
                        </tbody>
                    </table>
                    )}
                    </div>
                    <div style={{display:"flex",justifyContent:"center",marginTop: 40}}>
                        <button style={btn_s_style} onClick={() => createRemito()}>AGREGAR TODOS</button>
                    </div>

                </div>
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>DESGLOSES AGREGADOS</h2>
                </div>
                <div style={{maxHeight: maxheight,height:maxheight, overflow: "scroll",marginLeft: 30, width: 500}}>
                <table style={{width: "100%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                            <th style={{border: "1px solid", width: "90%"}}>DEPENDENCIA</th>
                            <th style={{border: "1px solid", width: "5%"}}>RACIONES</th>
                            <th style={{border: "1px solid", width: "5%"}}>TIPO</th>
                        </tr>
                        {detallesViaje.map((d,i) => (
                        <tr key={i} onClick={() => delRt(i)} id="del">
                            <th style={{border: "1px solid", width: "90%",textAlign: "left"}}>{d.des}</th>
                            <th style={{border: "1px solid", width: "5%"}}>{d.raciones}</th>
                            <th style={{border: "1px solid", width: "5%"}}>{d.fortificado ? "AL" : "CL"}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop: 40}}>
                    <button style={btn_s_style} onClick={() => createRemito()}>CREAR REMITO</button>
                </div>
            </div>
            <div >
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>REMITOS CREADOS</h2>
                </div>
                <div style={{maxHeight: maxheight,height:maxheight, overflow: "scroll",marginLeft: 30, width: 500}}>
                <table style={{width: "100%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                            <th style={{border: "1px solid", width: "90%"}}>PLAN</th>
                            <th style={{border: "1px solid", width: "5%"}}>LUGAR</th>
                            <th style={{border: "1px solid", width: "5%"}}>DESGLOSES</th>
                        </tr>
                        {remitos.map((r,i) => (
                        <tr key={i} id="del" onClick={() => delRtet(i)}>
                            <th style={{border: "1px solid", width: "90%",textAlign: "left"}}>{planReturner(r.plan_id)}</th>
                            <th style={{border: "1px solid", width: "5%"}}>{r.lenterga_id}</th>
                            <th style={{border: "1px solid", width: "5%"}}>{r.detalles.length}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop: 40}}>
                    <button style={btn_s_style} onClick={() => createRemito()}>CREAR VIAJE</button>
                </div>
            </div>
            </div>

        </div>
    )
}