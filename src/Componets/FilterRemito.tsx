"use client"

import {btn_s_style, btn_small_style, select_style, text_2_s_style } from "@/utils/styles";
import { CSSProperties, useEffect, useState } from "react";
import { IEstados, IExcelRemito, IRemitosEnvio, IReparto, IViajeRQ } from "@/utils/interfaces";
import { useRouter } from "next/navigation"
import refillEmptySpace from "@/utils/refillEmptySpace";
import ExcelBtn from "./ExcelBtn";


export default function FilterRemito ({remitos,estados,planes,stateMultipleFn,viajes}:{viajes:IViajeRQ[],remitos: IRemitosEnvio[],estados:IEstados[],planes:IReparto[],stateMultipleFn: (remitos: number[],state:number) => Promise<boolean> }) {
    const router = useRouter()
    const [selectedState, setSelectedState] = useState(0)
    const [selectedFac, setSelectedFac] = useState(0)
    const [selectedStC,setSelectedStC] = useState(0)
    const [selectedV,setSelectedV] = useState(-1)
    const [filterRemitos, setFilterRemitos] = useState<IRemitosEnvio[]>(remitos)
    const [changeStateMode, setChangeStateMode] = useState(false)
    const marginBwtFilters = 20
    const colorChange = (state: string,checked:boolean) => {
        if(checked) return '#00BFFF'
        if(state === "PENDIENTE") {
            return "gold"
        }
        else if(state === "PREPARADO") {
            return "lightgreen"
        }
        else if(state === "DESPACHADO") {
            return "Tan"
        }
        else if(state === "ENTREGADO") {
            return "Lime"
        }
        else if(state === "EXTRAVIADO" || state === "DEVOLUCION") {
            return "Tomato"
        }
        else if(state === "ENTRADA"){
            return "Orange"
        } 
    }

    const searchContainerStyle: CSSProperties = {
        backgroundColor: "#4A6EE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: 4,
        marginTop: 20,
        padding: 15,
    }

    useEffect(() => {
        let arr = remitos
        if(selectedState) arr = arr.filter((rt) => rt.estado_id === selectedState)
        if(selectedFac === 1) arr = arr.filter((rt) => rt.numf)
        if(selectedFac === 2) arr = arr.filter((rt) => !rt.numf)
        if(selectedV > -1) arr = arr.filter((rt) => rt.viaje_id === viajes[selectedV].viaje_id)
        setFilterRemitos(arr)
    },[selectedState,selectedFac,selectedV])

    useEffect(() => {
        let check = false
        filterRemitos.forEach(element => {
            if(element.checked) check = true
        });
        setChangeStateMode(check)
    },[filterRemitos])

    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }
    const excelData = () => {
        if(filterRemitos.length > 0) {
            const data: IExcelRemito[] = []
            filterRemitos.forEach(r => {
                data.push({
                    REMITO: parseRemitoToString(r.pv,r.numero),
                    ESTADO: r.estado,
                    TIPO: r.fortificado ? "ALMUERZO" : "COPA LECHE",
                    DIAS: r.dias,
                    FECHA_CREADO: r.fecha_creado.toISOString().split("T")[0],
                    FECHA_PREPARADO: r.fecha_preparado ? r.fecha_preparado.toISOString().split("T")[0] : "",
                    FECHA_DESPACHADO: r.fecha_despachado ? r.fecha_despachado.toISOString().split("T")[0] : "",
                    FECHA_ENTREGADO: r.fecha_entregado ? r.fecha_entregado.toISOString().split("T")[0] : "",
                    LUGARID: r.lentrega_id,
                    DEPARTAMENTO: r.departamento,
                    LOCALIDAD: r.localidad,
                    CABECERA:r.cabecera,
                    PLAN:r.pernumero+"-"+r.periodo,
                    FACTURA: r.pvf && r.numf ? parseRemitoToString(r.pvf,r.numf) : "",
                    RACIONES: r.raciones
                })
            });
            return data
        }
    }

    const checkRt = (chk:boolean,index:number) => {
        setFilterRemitos(prt => prt.map((rt,i) => i===index ? {...rt, checked: chk} : rt))
    }
    const checkAll = (chk:boolean) => {
        setFilterRemitos(prt => prt.map((rt) => {return {...rt,checked: chk}}))
    }
    const changeStateMultiple = async () => {
        const ids: number[] = []
        filterRemitos.forEach(f => {
            if(f.checked) ids.push(f.remito_id)
        });
        const res = await stateMultipleFn(ids,selectedStC)
        if(res) {
            alert("Remitos cambiados")
            window.location.reload()
        }
        else alert("Error al cambiar los remitos")

    }

    return(
        <div style={{width: "85%"}}>
            <div style={searchContainerStyle}>
                <div style={{display: "flex",justifyContent: "space-evenly"}}>
                    <div style={{margin: marginBwtFilters}}>
                        <h4 style={text_2_s_style}>ESTADO</h4>
                        <select name="estados_sel" id="state_sl" value={selectedState}
                        onChange={(e) => setSelectedState(parseInt(e.target.value))}
                        style={select_style}>
                            <option value={0}>---</option>
                            {estados.map((es) => (
                                <option key={es.estado_id} value={es.estado_id}>{es.des}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{margin: marginBwtFilters}}>
                        <h4 style={text_2_s_style}>FACTURADO</h4>
                        <select name="fac_sel" id="fc_sl" value={selectedFac}
                        onChange={(e) => setSelectedFac(parseInt(e.target.value))}
                        style={select_style}>
                            <option value={0}>---</option>
                            <option value={1}>SI</option>
                            <option value={2}>NO</option>
                        </select>
                    </div>
                    <div style={{margin: marginBwtFilters}}>
                        <h4 style={text_2_s_style}>VIAJE</h4>
                        <select name="estados_sel" id="state_sl" value={selectedV}
                        onChange={(e) => setSelectedV(parseInt(e.target.value))}
                        style={select_style}>
                            <option value={-1}>---</option>
                            {viajes.map((v,i) => (
                                <option key={i} value={i}>{v.des}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{marginTop: 40}}>
                        {filterRemitos.length > 0 && <ExcelBtn title="REMITOS" disable={filterRemitos.length > 0 ? false : true} data={excelData()} page="REMITOS" name={"REMITOS-"+filterRemitos[0].pernumero+"-"+filterRemitos[0].periodo}/>}
                    </div>
                </div>
            </div>
            {changeStateMode && (
            <div style={{marginTop: 20,marginBottom: 20}}>
                <select name="estados_sel" id="state_sl" value={selectedStC}
                onChange={(e) => setSelectedStC(parseInt(e.target.value))}
                style={{width: 450,fontSize:24}}>
                    <option value={0}>---</option>
                    {estados.map((es) => {
                        return(
                            <option key={es.estado_id} value={es.estado_id}>{es.des}</option>
                        )
                    })}
                </select>
                <div style={{marginTop: 15}}>
                    <button style={btn_s_style} onClick={() => changeStateMultiple()}>CAMBIAR ESTADO</button>
                </div>
            </div>
            )}
            <div>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", width: "2%"}}>
                                <input type="checkbox" onChange={(e) => checkAll(e.target.checked)}/>
                            </th>
                            <th style={{border: "1px solid", width: "20%"}}>REMITO</th>
                            <th style={{border: "1px solid", width: "20%"}}>LOCALIDAD</th>
                            <th style={{border: "1px solid", width: "20%"}}>DEPART.</th>
                            <th style={{border: "1px solid", width: "20%"}}>ESTADO</th>
                            <th style={{border: "1px solid", width: "8%"}}>REP.</th>
                            <th style={{border: "1px solid", width: "8%"}}>FAC.</th>
                            <th style={{border: "1px solid", width: "8%"}}>TIPO</th>
                        </tr>
                        {filterRemitos.length > 0 && filterRemitos.map((rt,i) => (
                        <tr style={{backgroundColor: colorChange(rt.estado,rt.checked)}} key={rt.remito_id}
                        onClick={() => router.push("/inicio/"+rt.remito_id)}>
                            <th style={{border: "1px solid", width: "2%"}} onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" onChange={(e) => checkRt(e.target.checked,i)} checked={rt.checked}/>
                            </th>
                            <th style={{border: "1px solid", width: "20%"}}>{parseRemitoToString(rt.pv,rt.numero)}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.localidad}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.departamento}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{rt.estado}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.reportes}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.numf ? "SI" : "NO"}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{rt.fortificado ? "AL" : "CL"}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}