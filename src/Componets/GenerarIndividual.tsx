"use client"

import { IAddRemito, IDesglose, IEnvioDetallesParsed, IInsumo, ILentrega, IPlan, IViajeDetalle, IViajeRemito, IViajeRQ } from "@/utils/interfaces"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"
import viajeInsumosParseDisplay from "@/utils/viajeInsumosParseDisplay"
import parsedRemitosToGenerate from "@/utils/parsedRemitosToGenerate"



export default function GenerarIndividual ({escuelas,departamentos,planes,insumos,generateFn,reparto}:
    {escuelas: ILentrega[],departamentos:string[],planes:IPlan[],insumos:IInsumo[], reparto:number,
    generateFn: (remitos: IAddRemito[])=> Promise<boolean>}) {
    const [desgloses,setDesgloses] = useState<IDesglose[]>([])
    const [selectedP, setSelectedP] = useState(-1)
    const [selectedDep, setSelectedDep] = useState("")
    const [selectedLgr, setSelectedLgr] = useState(-1)
    const [filteredLgrs, setFilteredLgrs] = useState<ILentrega[]>(escuelas)
    const [updater,setUpdater] = useState(0)
    const [detallesViaje,setDetallesViaje] = useState<IDesglose[]>([])
    const [remitos, setRemitos] = useState<IViajeRemito[]>([])
    const [prev,setPrev] = useState<IEnvioDetallesParsed[]>([])
 
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
        setDetallesViaje([])
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

    const checkNoRepeat = () =>  {
        let status = true
        const lgr = detallesViaje[0].lentrega_id
        detallesViaje.forEach(d => {
            if(d.lentrega_id !== lgr) status = false
        });
        return status
    }
    
    const createRemito = () => {
        if(detallesViaje.length > 0) {
            if(checkNoRepeat()) {
                const detalle:IViajeDetalle[] = []
                detallesViaje.forEach(d => {
                    detalle.push({
                        desglose_id: d.desglose_id,
                        raciones: d.raciones
                    })
                });
                const remito: IViajeRemito = {
                    plan_id: planes[selectedP].plan_id,
                    lenterga_id: filteredLgrs[selectedLgr].lentrega_id,
                    detalles: detalle
                }
                setRemitos([...remitos, remito])
                setDetallesViaje([])
                setDesgloses([])
                setSelectedLgr(-1)
                setSelectedDep("")
                setUpdater(updater + 1)
            }
            else alert("Lugar de entrega repetido")
        }
        else alert("Ingrese desgloses.")

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
    const prevRemitos = () => {
        setPrev(viajeInsumosParseDisplay(insumos,planes,remitos))
    }
    const planReturner = (id:number) : string => {
        let des = ""
        planes.forEach(p => {
            if(p.plan_id === id) des = p.des+" x "+p.dias
        });
        return des
    }

    const generarRemitos = async () => {
        if(confirm("¿Quieres crear estos remitos?") && remitos) {
            const remitosP = parsedRemitosToGenerate(remitos,planes,insumos,reparto)
            const res = await generateFn(remitosP)
            if(res) {
                alert("Remitos creados")
                window.location.reload()
            } else alert("Error al crear los remitos")
        }
    }

    return (
        <div style={{marginLeft: 25, marginBottom: 100}}>
            <div style={{display: "flex",marginLeft: 10}}>
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
                                if(selectedP > -1 && d.fortificado === planes[selectedP].fortificado && !checkDesglose(d.desglose_id) && !checkDesgloseRemitos(d.desglose_id) && !d.selected) {
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
                    <button style={btn_s_style} onClick={() => generarRemitos()}>CREAR REMITOS</button>
                    <button style={btn_s_style} onClick={() => prevRemitos()}>?</button>
                </div>
            </div>
            </div>
            {prev.length > 0 && 
            <div >
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>PREVISUALIZACION</h2>
                </div>
                <div style={{maxHeight: maxheight,height:maxheight, overflow: "scroll",marginLeft: 30, width: 1000}}>
                <table style={{width: "100%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                            <th style={{border: "1px solid", width: "60%"}}>INS</th>
                            <th style={{border: "1px solid", width: "10%"}}>UNIDADES</th>
                            <th style={{border: "1px solid", width: "10%"}}>PALETS</th>
                            <th style={{border: "1px solid", width: "10%"}}>CAJAS</th>
                            <th style={{border: "1px solid", width: "10%"}}>BOLSAS</th>
                            <th style={{border: "1px solid", width: "10%"}}>KILOS</th>
                            <th style={{border: "1px solid", width: "10%"}}>RACIONES</th>
                        </tr>
                        {prev.map((r,i) => (
                        <tr key={i} >
                            <th style={{border: "1px solid", width: "60%",textAlign: "left"}}>{r.des}</th>
                            <th style={{border: "1px solid", width: "10%"}}>{r.unidades}</th>
                            <th style={{border: "1px solid", width: "10%"}}>{r.palet}</th>
                            <th style={{border: "1px solid", width: "10%"}}>{r.cajas}</th>
                            <th style={{border: "1px solid", width: "10%"}}>{r.bolsas}</th>
                            <th style={{border: "1px solid", width: "10%"}}>{r.kilos.toFixed(2)}</th>
                            <th style={{border: "1px solid", width: "10%"}}>{r.raciones}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
            }
        </div>
    )
}