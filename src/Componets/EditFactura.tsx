"use client"

import { IAddFactura, IFacturaAgrupado, IRemitoInFactura, IRemitosNoF, IReparto } from "@/utils/interfaces"
import refillEmptySpace from "@/utils/refillEmptySpace"
import { btn_s_style, select_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"



export default function EditFactura ({facturas,deleteFn,closeFn,remitoReturner,repartos,createFactura}:{facturas:IFacturaAgrupado[],deleteFn:(remitos: number[])=>Promise<boolean>,closeFn:(pv:number,nro:number)=>Promise<boolean>,remitoReturner: (reparto: number) => Promise<IRemitosNoF[] | null>,repartos: IReparto[],createFactura: (data: IAddFactura[]) => Promise<boolean>}) {

    const [selectedF, setSelectedF] = useState(0)
    const [option, setOption] = useState(0)
    const [remitos, setRemitos] = useState<IRemitosNoF[]>([])
    const [addedRemitos, setAddedRemitos] = useState<IRemitosNoF[]>([])
    const [selectedReparto, setSelectedReparto] = useState(-1)
    const [remitosDel, setRemitosDel] = useState<IRemitoInFactura[]>([])
    const [updater,setUpdater] = useState(0)
    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }

    useEffect(() => {
        setRemitosDel([])
        setRemitos([])
        setSelectedReparto(-1)
        setAddedRemitos([])
    },[option])
    
    const applyEdit = async () => {
        let check = false
        if(confirm("¿Quieres realizar los cambios a la factura?")) {
            if(option === 1 && addedRemitos.length > 0) {
                const data: IAddFactura[] = addedRemitos.map((rts) => {
                    return{
                        raciones: rts.raciones ? parseInt(rts.raciones) : 0 ,
                        remito_id: rts.remito_id,
                        fecha_factura: facturas[selectedF].fecha_factura.toISOString().split("T")[0],
                        numero: facturas[selectedF].numero,
                        pv: facturas[selectedF].pv
                    }
                })
                check = await createFactura(data)
            }
            if(option === 2) {
                check = await deleteFn(remitosDel.map(rt => rt.remito_id))
                
            }
            if(option === 3 && facturas[selectedF]) {
                check = await closeFn(facturas[selectedF].pv,facturas[selectedF].numero)
            }
            if(check) {
                alert("FACTURA MODIFICADA EXITOSAMENTE")
                window.location.reload()
            }
            else alert("ERROR AL MODIFICAR FACTURA")
        }

    }

    const displayDelete = () => {

        const delRt = (index:number) => {
            const arr = remitosDel
            arr.splice(index,1)
            setRemitosDel(arr)
            setUpdater(updater + 1)
        }

        const checkDelete = (id:number) => {
            return remitosDel.find((rt) => rt.remito_id === id)
        }
        const checkIfAdded = (idToAdd:number):boolean => {
            let check = true
            remitosDel.forEach(rt => {
                if(rt.remito_id === idToAdd) {
                    check = false
                    return false
                }
            });
            return check
        }

        return(
            <div style={{display: "flex",justifyContent:"start"}}>
                <div style={{width: "45%"}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA LA FACTURA</h2>
                    <div style={{height: 300,overflow: "scroll"}}>
                        {selectedF > -1 && facturas[selectedF].remitos ? 
                        <table style={{width: "100%", maxHeight: 300}}>
                            <tbody>
                                <tr>
                                    <th style={{border: "1px solid", fontSize: 20}}>REMITO</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                                </tr>
                                {facturas[selectedF].remitos.map((d,i) => (
                                <tr key={i} onClick={() => checkIfAdded(d.remito_id) ? setRemitosDel([...remitosDel,d]) : alert("Remito ya agregado.")}
                                style={{backgroundColor: checkDelete(d.remito_id) ? "red" : "white"}}>
                                    <th style={{border: "1px solid", fontSize: 20}}>{parseRemitoToString(d.pv,d.numero)}</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        :<h2 style={text_2_t_style}>SELECCIONE UNA FACTURA PARA VER EL DETALLE</h2>}
                    </div>
                </div>
                <div style={{width: "45%",marginLeft: 40}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>REMITOS A ELIMINAR</h2>
                    <div style={{height: 300,overflow: "scroll"}}>
                        {remitosDel && 
                        <table style={{width: "100%", maxHeight: 300}}>
                            <tbody>
                                <tr>
                                    <th style={{border: "1px solid", fontSize: 20}}>REMITO</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                                </tr>
                                {remitosDel.map((d,i) => (
                                    <tr key={i} onClick={() => delRt(i)}>
                                        <th style={{border: "1px solid", fontSize: 20}}>{parseRemitoToString(d.pv,d.numero)}</th>
                                        <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </div>
                </div>
            </div>
        )
    }

    const displayAdd = () => {
        
        const changeReparto = async (id:number) => {
            if(id > -1) {
                setSelectedReparto(id)
                setRemitos([])
                const rts = await remitoReturner(id)
                setRemitos(rts ? rts : [])
            }
        }
        const checkRemito = (id:number) => {
            return addedRemitos.find((rt) => rt.remito_id === id)
        }
        const delRt = (index:number) => {
            const arr = addedRemitos
            arr.splice(index,1)
            setAddedRemitos(arr)
            setUpdater(updater + 1)
        }


        return (
            <div>
                <div>
                    <h2 style={text_2_t_style}>SELECCIONE EL PLAN:</h2>
                    <select name="rp_sel" id="rp_sl" value={selectedReparto}
                    onChange={(e) => changeReparto(parseInt(e.target.value))}
                    style={select_style}>
                        <option key={-1} value={-1}>---</option>
                        {repartos.map((p) => (
                            <option key={p.reparto_id} value={p.reparto_id}>{p.numero+"-"+p.periodo}</option>
                        ))}
                    </select>
                </div>
            <div style={{display: "flex",justifyContent: "start",marginTop: 50}}>
                <div>
                    <h2 style={text_2_t_style}>REMITOS PENDIENTES A FACTURAR EN EL PLAN: {remitos.length > 0 ? remitos.length : "0"}</h2>
                    <div style={{height: 450,overflow: "scroll",marginTop: 40}}>
                        {remitos.length > 0 ? 
                            <table style={{width: "100%", maxHeight: 400}}>
                                <tbody>
                                    <tr>
                                        <th style={{border: "1px solid", fontSize: 20}}>REMITO</th>
                                        <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                                    </tr>
                                    {remitos.map((d,i) => {
                                        if(!checkRemito(d.remito_id)) {
                                            return(
                                                <tr key={d.remito_id} onClick={() => setAddedRemitos([...addedRemitos,d])}>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{parseRemitoToString(d.pv,d.numero)}</th>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        :
                        <h2 style={text_2_t_style}>SELECCIONE UN PLAN</h2>
                        }
                    </div>
                </div>
                <div style={{marginLeft: 200}}>
                <div>
                    <h2 style={text_2_t_style}>REMITOS AGREGADOS A LA NUEVA FACTURA: {addedRemitos.length}</h2>
                    <div style={{height: 450,overflow: "scroll",marginTop: 40}}>
                        <table style={{width: "100%", maxHeight: 400}}>
                            <tbody>
                                <tr>
                                    <th style={{border: "1px solid", fontSize: 20}}>REMITO</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                                </tr>
                                {addedRemitos.map((d,i) => (
                                <tr key={i} onClick={() => delRt(i)}>
                                    <th style={{border: "1px solid", fontSize: 20}}>{parseRemitoToString(d.pv,d.numero)}</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )
    }

    return(
        <div>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA LA FACTURA</h2>
                <select name="estados_sel" id="state_sl" value={selectedF}
                onChange={(e) => setSelectedF(parseInt(e.target.value))}
                style={{width: 450,fontSize:24,marginBottom: 20}}>
                    <option value={-1}>---</option>
                    {facturas.map((f,i) => {
                        if(!f.cerrado) {
                            return (<option key={i} value={i}>{parseRemitoToString(f.pv,f.numero)}</option>)
                        }
                    })}
                </select>
            </div>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA LA OPCION</h2>
                <select name="estados_sel" id="state_sl" value={option}
                onChange={(e) => setOption(parseInt(e.target.value))}
                style={{width: 450,fontSize:24,marginBottom: 20}}>
                    <option value={0}>---</option>
                    <option value={1}>AGREGAR REMITOS</option>
                    <option value={2}>ELIMINAR REMITOS</option>
                    <option value={3}>CERRAR FACTURA</option>
                </select>
            </div>
            {option === 1 && displayAdd()}
            {option === 2 && displayDelete()}
            {option &&
            <div style={{marginTop: 50,display:"flex",justifyContent:"center"}}>
                <button style={btn_s_style} onClick={() => applyEdit()}>
                    CONFIRMAR CAMBIOS EN LA FACTURA
                </button>
            </div>
            }

        </div>
    )

}