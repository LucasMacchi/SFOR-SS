"use client"
import { IDesglose, IEnvioDetallesParsed, IInsumo, ILentrega, IPlan, IReparto, IViajeDetalle, IViajeRQ } from "@/utils/interfaces";
import { useEffect, useState } from "react";

//@ts-ignore
import "./css/hoverTableCell.css"
import { btn_d_style, btn_s_style, select_style, text_2_g_style, text_2_t_style } from "@/utils/styles";
import viajeRemitoInsumoParaseDisplay from "@/utils/viajeRemitoInsumoParaseDisplay";

export default function DisplayPlanes ({viajes,deleteFn,insumos,planes,lugares,repartos,duplicateViajeFn,addViajeDetalleFn,
    activarViajeFn,unirViajesFn,editVRemitoFn,deleteViajeAllFn}:
    {viajes:IViajeRQ[],repartos: IReparto[],deleteFn:(id:number,table:string,column: string) => Promise<boolean>,
    insumos:IInsumo[],planes: IPlan[],lugares:ILentrega[],
    addViajeDetalleFn: (detail:IViajeDetalle,id:number) => Promise<boolean>,
    activarViajeFn: (id:number,state:boolean) => Promise<boolean>,
    duplicateViajeFn: (v: IViajeRQ,reparto: number) => Promise<boolean>,
    unirViajesFn: (viaje:number, nuevo:number) => Promise<boolean>,
    editVRemitoFn:(vremito: number,plan: number) => Promise<boolean>,
    deleteViajeAllFn: (v:number) => Promise<boolean>}) {

    const [selectedViaje,setSelectedViaje] = useState(-1)
    const [selectedViajeU,setSelectedViajeU] = useState(-1)
    const [selectedRt,setSelectedRt] = useState(-1)
    const [selectPlan, setSelectPlan] = useState(-1)
    const [selectedRep,setSelectedRep] = useState(-1)
    const [prev,setPrev] = useState<IEnvioDetallesParsed[]>([])
    const [desgloses,setDesgloses] = useState<IDesglose[]>([])
    const [option, setOption] = useState(false)
    const [exportOpt, setExportOpt] = useState(false)
    const [unirOpt, setUnirOpt] = useState(false)
    const [planOpt, setPlanOpt] = useState(false)

    const deleteRemito = async () => {
        const remito = viajes[selectedViaje].remitos[selectedRt]
        if(confirm("¿Quieres eliminar el remito de "+remito.completo+"?")) {
            if(remito.vremito_id) {
                const res = await deleteFn(remito.vremito_id,'viaje_remito','vremito_id')
                if(res) {
                    alert("Remito eliminado")
                    window.location.reload()
                }
                else alert("Error al eliminar.")
            }
        }
    }
    const deleteViajeCompleto = async () => {
        const viaje = viajes[selectedViaje]
        if(confirm(`¿Quieres eliminar el viaje ${viaje.des} de forma permantente? (No podra ser restablecido)`)) {
            if(!viaje.procesado) {
                if(viaje.viaje_id) {
                    const res = await deleteViajeAllFn(viaje.viaje_id)
                    if(res) {
                        alert("Viaje eliminado")
                        window.location.reload()
                    }
                    else alert("Error al eliminar.")
                }
            }
            else alert("Viaje ya procesado.")

        }
    }
    const addDesglose = async (d:IDesglose) => {
        if(!d) return 0
        let chack = false
        viajes[selectedViaje].remitos[selectedRt].detalles.forEach((ds) => {if(ds.desglose_id === d.desglose_id) chack = true})
        if(chack) {
            alert("Desglose ya existe dentro del remito")
            return 0
        }
        if(confirm("¿Quieres agregar "+d.des+" al remito?") && selectedRt > -1 && selectedViaje > -1) {
            const rt = viajes[selectedViaje].remitos[selectedRt]
            const data: IViajeDetalle = {desglose_id: d.desglose_id,raciones: d.raciones}
            const res = await addViajeDetalleFn(data,rt.vremito_id)
                if(res) {
                    alert("Desglose agregado.")
                    window.location.reload()
                }
                else alert("Error al agregar desglose.")
        }
    }
    const deleteDesglose = async (id:number) => {
        const desid = id
        if(confirm("¿Quieres eliminar el desglose?")) {
            if(desid) {
                const res = await deleteFn(desid,'viaje_detalle','detalle_id')
                if(res) {
                    alert("Desglose eliminado")
                    window.location.reload()
                }
                else alert("Error al eliminar.")
            }
        }
    }
    const editPlanRemito = async (id:number) => {
        if(confirm("¿Quieres cambiar el plan del remito?")) {
            const planId = id
            const vremitoId = viajes[selectedViaje].remitos[selectedRt].vremito_id
            if(planId && vremitoId) {
                const res = await editVRemitoFn(vremitoId,planId)
                if(res) {
                    alert("Plan de Remito modificado")
                    window.location.reload()
                }
                else alert("Error al modificar.")
            }
        }
    }
    const activarViaje = async () => {
        if(confirm("¿Quieres activar devuelta este viaje?") && selectedViaje > -1) {
            const res = await activarViajeFn(viajes[selectedViaje].viaje_id,false)
            if(res){
                alert("Viaje activado devuelta.")
                window.location.reload()
            }
            else alert ("Error al activar el viaje.")
        }
    }
    const unirViaje = async () => {
        if(selectedViajeU > -1 && selectedViaje > -1) {
            const viaje = viajes[selectedViaje].viaje_id
            const nuevo = viajes[selectedViajeU].viaje_id
            const viajeDes = viajes[selectedViaje].des
            const viajeNDes = viajes[selectedViajeU].des
            const unirDes = `Viajes unidos: ${viajeDes} => ${viajeNDes}`
            if(viaje && nuevo && confirm("¿Quieres unir estos dos viajes? Al hacerlo el primer viaje seleccionado se eliminara."+unirDes)) {
                const res = await unirViajesFn(viaje, nuevo)
                if(res) {
                    alert(unirDes)
                    window.location.reload()
                }
                else alert(`Erro al unir los viajes. `+unirDes)
            }
        }
    }
    const exportar = async () => {
        if(selectedRep > -1 && selectedViaje > -1) {
            const reparto = repartos[selectedRep].numero + " - "+repartos[selectedRep].periodo
            if(confirm("¿Quieres exportar este viaje al plan "+reparto+" ?")) {
                const res = await duplicateViajeFn(viajes[selectedViaje],repartos[selectedRep].reparto_id)
                if(res){
                    alert("Viaje exportado correctamente.")
                    window.location.reload()
                }
                else alert ("Error al exportado el viaje.")
            }
        }
        else alert("Seleccione un viaje o un plan existente.")
    }
    useEffect(() => {
        setSelectedRt(-1)
        setDesgloses([])
        setOption(false)
        setUnirOpt(false)
        setSelectedViajeU(-1)
        setPrev([])
        setSelectedRep(-1)
    },[selectedViaje])

    useEffect(() => {
        if(selectedRt > -1 && selectedViaje > -1) {
            const rto = viajes[selectedViaje].remitos[selectedRt]
            setPrev(viajeRemitoInsumoParaseDisplay(insumos,planes,rto)) 
        }
    },[selectedRt])

    useEffect(() => {
        if(selectedRt > -1 && selectedViaje > -1 && viajes[selectedViaje]) {
            const lgr = viajes[selectedViaje].remitos[selectedRt] ? viajes[selectedViaje].remitos[selectedRt].lentrega_id : 0
            if(option && lgr) {
                lugares.forEach(l => {
                    if(l.lentrega_id === lgr) setDesgloses(l.desgloses ? l.desgloses : [])
                });
            }
        }

    },[option])

    const typePlanReturner = (id:number) => {
        return planes.find(pls => pls.plan_id === id)?.fortificado || false
    }
    
    return (
        <div>
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL VIAJE</h2>
                    <select name="estados_sel" id="state_sl" value={selectedViaje}
                    onChange={(e) => setSelectedViaje(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {viajes.map((p,i) => {
                            if(p.remitos.length > 0) {
                                return <option key={i} value={i}>{p.des}</option>
                            }
                        })}
                    </select>
                </div>
                {selectedViaje > -1 &&
                <div>
                    {(viajes[selectedViaje]) && (
                        <div style={{display:"flex"}}>
                            <div >
                                {!viajes[selectedViaje].procesado &&<button style={{...btn_s_style,margin:5}} onClick={() => setExportOpt(!exportOpt)}>EXPORTAR VIAJE A OTRO PLAN</button>}
                            </div>
                            <div >
                                <button style={{...btn_s_style,margin:5}} onClick={() => setUnirOpt(!unirOpt)}>UNIR VIAJE</button>
                                <button style={{...btn_d_style,margin:5}} onClick={() => deleteViajeCompleto()}>ELIMINAR</button>
                            </div>
                        </div>

                    )}
                    {(viajes[selectedViaje] && exportOpt) && (
                        <div >
                            <h2 style={{...text_2_t_style, marginTop: 40}}>ELIGE EL REPARTO</h2>
                            <select name="rp_sel" id="rp_sl" value={selectedRep}
                            onChange={(e) => setSelectedRep(parseInt(e.target.value))}
                            style={select_style}>
                                <option value={-1}>---</option>
                                {repartos.map((p,i) => (
                                    <option key={i} value={i}>{p.numero+"-"+p.periodo}</option>
                                ))}
                            </select>
                            <button style={{...btn_s_style,margin:5}} onClick={() => exportar()}>EXPORTAR</button>
                        </div>
                    )}
                    {(viajes[selectedViaje] && unirOpt) && (
                        <div >
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL VIAJE A UNIR</h2>
                                <select name="estados_sel" id="state_sl" value={selectedViajeU}
                                onChange={(e) => setSelectedViajeU(parseInt(e.target.value))}
                                style={{width: 500,fontSize:24,marginBottom: 20}}>
                                    <option value={-1}>---</option>
                                    {viajes.map((p,i) => {
                                        if(p.remitos.length > 0 && !p.procesado && i !== selectedViaje) {
                                            return <option key={i} value={i}>{p.des}</option>
                                        }
                                    })}
                                </select>
                            </div>
                            <button style={{...btn_s_style,margin:5}} onClick={() => unirViaje()}>UNIR</button>
                        </div>
                    )}
                    {viajes[selectedViaje].procesado && (
                        <div >
                            <h2 style={{...text_2_g_style, marginTop: 40}}>VIAJE YA PROCESADO</h2>
                            <button style={{...btn_s_style,margin:5}} onClick={() => activarViaje()}>ACTIVAR</button>
                        </div>
                    )}
                    <div style={{display: "flex", alignItems:"baseline"}}>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL REMITO</h2>
                        <button style={{...btn_d_style,margin:5}} onClick={() => deleteRemito()} disabled={selectedRt > -1 ? false:true}>BORRAR</button>
                        <button style={{...btn_s_style,margin:5}} onClick={() => setOption(!option)} disabled={selectedRt > -1 ? false:true}>+</button>
                    </div>
                    <select name="estados_sel" id="state_sl" value={selectedRt}
                    onChange={(e) => setSelectedRt(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {viajes[selectedViaje].remitos.map((r,i) => (
                            <option key={i} value={i}>{r.lentrega_id+"-"+r.completo}</option>
                        ))}
                    </select>
                    {selectedRt > -1 && (
                    <div >
                        <button style={{...btn_s_style,margin:5}} onClick={() => setPlanOpt(!planOpt)}>{planOpt ? "CANCELAR CAMBIO":"CAMBIAR PLAN"}</button>
                    </div>
                    )}
                    {planOpt && (
                    <div>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL PLAN</h2>
                        <select name="estados_sel" id="state_sl" onChange={async (e) => await editPlanRemito(parseInt(e.target.value))}
                        style={{width: 500,fontSize:24,marginBottom: 20}}>
                            <option value={0}>---</option>
                            {planes.map((p,i) => (
                                <option key={i} value={p.plan_id}>{p.des+" - "+p.dias+" DIAS"}</option>
                            ))}
                        </select>
                    </div>
                    )}
                    {(option && desgloses.length > 0) && (
                    <div>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL DESGLOSE A AGREGAR</h2>
                        <select name="estados_sel" id="state_sl"
                        onChange={(e) => addDesglose(desgloses[parseInt(e.target.value)])}
                        style={{width: 500,fontSize:24,marginBottom: 20}}>
                            <option value={-1}>---</option>
                            {desgloses.map((d,i) =>  (
                                (!d.selected && typePlanReturner(viajes[selectedViaje].remitos[0].plan_id) === d.fortificado) && <option key={i} value={i}>{d.des+" - "+(d.fortificado ? "AL" : "CL")}</option>
                            ))}
                        </select>
                    </div>
                    )}
                </div>
                }
            </div>
            <div style={{display:"flex", justifyContent: "start"}}>
                {(selectedViaje > -1 && selectedRt > -1 && viajes[selectedViaje] && viajes[selectedViaje].remitos[selectedRt]) &&
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>
                       {viajes[selectedViaje].remitos[selectedRt].des + " - "+viajes[selectedViaje].remitos[selectedRt].dias+" DIAS"}
                    </h2>
                    <table style={{width: "100%", fontSize: 16}}>
                        <tbody>
                            <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                                <th style={{border: "1px solid", width: "80%"}}>DEPENDENCIA</th>
                                <th style={{border: "1px solid", width: "5%"}}>RACIONES</th>
                                <th style={{border: "1px solid", width: "5%"}}>RACIONES X DIAS</th>
                            </tr>
                            {viajes[selectedViaje].remitos[selectedRt].detalles.map((d,i) => {
                                return (
                                <tr key={i} id="del" onClick={() => deleteDesglose(d.detalle_id)}>
                                    <th style={{border: "1px solid", width: "80%",textAlign: "left"}}>{d.des}</th>
                                    <th style={{border: "1px solid", width: "5%"}}>{d.raciones}</th>
                                    <th style={{border: "1px solid", width: "5%"}}>{d.raciones * viajes[selectedViaje].remitos[selectedRt].dias}</th>
                                </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
                }
                {prev.length > 0 && (
                <div style={{maxHeight: 320,height:320, overflow: "scroll",marginLeft: 50, width: 1000}}>
                <h2 style={{...text_2_t_style, marginTop: 40}}>
                    DETALLADO DEL REMITO
                </h2>
                <table style={{width: "80%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                            <th style={{border: "1px solid", width: "60%"}}>INS</th>
                            <th style={{border: "1px solid", width: "10%"}}>UNIDADES</th>
                            <th style={{border: "1px solid", width: "10%"}}>PALETS</th>
                            <th style={{border: "1px solid", width: "10%"}}>CAJAS</th>
                            <th style={{border: "1px solid", width: "10%"}}>BOLSAS</th>
                            <th style={{border: "1px solid", width: "10%"}}>KILOS</th>
                            <th style={{border: "1px solid", width: "10%"}}>RAC</th>
                        </tr>
                        {prev.map((r,i) => (
                        <tr key={i}>
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
                )}
            </div>
        </div>
    )
}
