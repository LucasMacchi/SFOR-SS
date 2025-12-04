"use client"

import convertToMoney from "@/utils/convertToMoney"
import { IAddFactura, IRemitosNoF, IReparto } from "@/utils/interfaces"
import refillEmptySpace from "@/utils/refillEmptySpace"
import { btn_s_style, select_style, text_2_s_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"



export default function CreateFacturaDisplay ({nextF,remitoReturner,pv,repartos,createFactura, valor} : {nextF:number,remitoReturner: (reparto: number) => Promise<IRemitosNoF[] | null>,pv:number,repartos: IReparto[],createFactura: (data: IAddFactura[]) => Promise<boolean>,valor:number}) {
    const [confCreation, setConfCreation] = useState(false)
    const [remitos, setRemitos] = useState<IRemitosNoF[]>([])
    const [addedRemitos, setAddedRemitos] = useState<IRemitosNoF[]>([])
    const [facturaDate, setFacturaDate] = useState("")
    const [updater,setUpdater] = useState(0)
    const [selectedReparto, setSelectedReparto] = useState(repartos.length )

    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }
    const changeConf = async (type: boolean) => {
        setConfCreation(type)
        if(type) {
            const rts = await remitoReturner(selectedReparto)
            setRemitos(rts ? rts : [])
        }
        else {
            setRemitos([])
            setAddedRemitos([])
        }
    }
    const changeReparto = async (id:number) => {
        setSelectedReparto(id)
        setRemitos([])
        const rts = await remitoReturner(id)
        setRemitos(rts ? rts : [])
    }
    const racionesAdded = () => {
        let rac = 0
        addedRemitos.forEach(r => {
            rac += r.raciones ? parseInt(r.raciones) : 0
        });
        return rac
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

    const createFacturaFn = async () => {
        if(facturaDate.length > 0 && addedRemitos.length > 0 && confirm("¿Quieres crear esta nueva factura?")) {
            const data: IAddFactura[] = addedRemitos.map((rts) => {
                return{
                    raciones: rts.raciones ? parseInt(rts.raciones) : 0 ,
                    remito_id: rts.remito_id,
                    fecha_factura: facturaDate,
                    numero: nextF,
                    pv: pv
                }
            })
            const res = await createFactura(data)
            if(res) {
                alert("Factura Creada.")
                window.location.reload()
            } 
            else alert("Error al crear nueva factura.")
        } else alert("Faltan datos.")
    }
    const displayCreacion = () => {


        return(
            <div style={{display: "flex",justifyContent: "start",marginTop: 50}}>
                <div>
                    <h2 style={text_2_t_style}>REMITOS PENDIENTES A FACTURAR EN EL PLAN: {remitos.length > 0 ? remitos.length : "CARGANDO REMITOS..."}</h2>
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
                        <h2 style={text_2_t_style}>CARGANDO REMITOS...</h2>
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
                    <h2 style={text_2_t_style}>RACIONES DE LA NUEVA FACTURA: {racionesAdded()}</h2>
                    <h2 style={text_2_t_style}>VALOR DE LA NUEVA FACTURA: {convertToMoney(racionesAdded() * valor)}</h2>
                </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div style={{display:"flex" ,justifyContent: "center"}}>
                <button style={btn_s_style} onClick={() => changeConf(!confCreation)}>
                    {confCreation ? "CANCELAR CREACION DE FACTURA" : "CREAR NUEVA FACTURA"}
                </button>
            </div>
            <div style={{display:"flex" ,justifyContent: "center"}}>
                {confCreation && <h2 style={text_2_t_style}>NUEVA FACTURA: {parseRemitoToString(pv,nextF)}</h2>}
            </div>
            {confCreation && 
                <div>
                    <h2 style={text_2_t_style}>SELECCIONE EL PLAN:</h2>
                    <select name="rp_sel" id="rp_sl" value={selectedReparto}
                    onChange={(e) => changeReparto(parseInt(e.target.value))}
                    style={select_style}>
                        {repartos.map((p) => (
                            <option key={p.reparto_id} value={p.reparto_id}>{p.numero+"-"+p.periodo}</option>
                        ))}
                    </select>
                </div>
            }
            {confCreation && 
            <div>
                <h2 style={text_2_t_style}>FECHA DE FACTURACION:</h2>
                <input type="date" value={facturaDate} style={{fontSize: 20}} onChange={(e) => setFacturaDate(e.target.value)} />
            </div>
            }
            {confCreation && displayCreacion()}
            {(confCreation && remitos.length > 0) &&
            <div style={{marginTop: 50,display:"flex",justifyContent:"center"}}>
                <button style={btn_s_style} onClick={() => createFacturaFn()}>
                    CONFIRMAR CREACION DE FACTURA
                </button>
            </div>

            }
        </div>
    )
}