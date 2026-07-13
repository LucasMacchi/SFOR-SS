"use client"

import convertToMoney from "@/utils/convertToMoney";
import { IAddLote, IInsumo, ILote, ILoteLog, IMarca } from "@/utils/interfaces";
import {btn_d_style, btn_s_style, text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";
import Image from "next/image"
import * as XLSX from 'xlsx';

const iniLote:IAddLote = {
    marca_id: 0,
    rnpa:"",
    rne: "",
    unidades: 0,
    ins_id: 0,
    monto_factura: 0,
    factura: "",
    fecha_venc: "",
    nro: ""
}

const razonesSalida = ["VENCIMIENTO","DAÑO","AJUSTE","EL POPULAR","ROBO/PERDIDA"]

export default function DisplayStock ({insumos,insumosB,lotes,marcas,addLoteFn,addUnidadesLote,salidaUnidadesLoteFn,
    bajaLoteFn,descontarUnidadesLoteFn,logLoteFn,userRol}:{marcas:IMarca[], insumos:IInsumo[],
    insumosB:IInsumo[],lotes:ILote[], userRol:number,
    addLoteFn: (lote: IAddLote) => Promise<boolean>,
    addUnidadesLote:(l:number,lname:string ,newUnidades: number,prev:number,i:number) => Promise<boolean>,
    bajaLoteFn: (lote:number,lname:string,state:boolean,i:number) => Promise<boolean>,
    descontarUnidadesLoteFn: (l:number,lname:string ,newUnidades: number,prev:number,i:number) => Promise<boolean>,
    logLoteFn: (lote:number) => Promise<ILoteLog[]>, salidaUnidadesLoteFn: (l:number,lname:string ,newUnidades: number,prev:number,i:number,cat:string) => Promise<boolean>
}) {

    const [selectedI, setSelectedI] = useState(0)
    const [option, setOption] = useState(0)
    const [loteAdd, setLoteAdd] = useState<IAddLote>(iniLote)
    const [razonLote, setRazonLote] = useState("")
    const [selectedLote, setSelectedLote] = useState(0)
    const [cant, setCant] = useState(0)

    const color = "#32CD32"

    useEffect(() => {
        setLoteAdd(iniLote)
    },[selectedI])

    const cajasCalc = (und: number |undefined,cajas_ratio:number) => {
        return und ? Math.floor(und / cajas_ratio) : 0
    }

    const paletsCalc = (und: number |undefined,cajas_ratio:number, palet_ratio: number) => {
        return und ? Math.floor(Math.floor(und / cajas_ratio) / palet_ratio) : 0
    }
    
    const downLoadExcel = async () => {
        const logs = await logLoteFn(selectedI)
        const worksheet = XLSX.utils.json_to_sheet(logs)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook,worksheet,"LOGS")    

        XLSX.writeFile(workbook,'LOGS.xlsx')
    }

    const createLote = async () => {
        if(loteAdd.factura.length > 0 && loteAdd.fecha_venc.length > 0 && loteAdd.marca_id && loteAdd.monto_factura && 
            loteAdd.nro.length > 0 && loteAdd.rne.length > 0 && loteAdd.rnpa.length > 0 && loteAdd.unidades) {
            if(confirm("¿Quieres generar el Lote?")) {
                loteAdd.ins_id = selectedI
                const res = await addLoteFn(loteAdd)
                if(res){
                    alert("LOTE AÑADIDO")
                    window.location.reload()
                }
                else alert("ERROR AL CREAR EL LOTE")
            }
        }
        else alert("FALTAN DATOS")
    }

    const addUndLote = async (lote_id : number,ins:number,actuales:number,lnro: string) => {
        const x = prompt("INGRESE CUANTO QUIERES AGREGAR AL LOTE: ","0")
        if(x && parseInt(x) && parseInt(x) > 0) {
            const res = await addUnidadesLote(lote_id,lnro,parseInt(x),actuales,ins)
            if(res) {
                alert("UNIDADES AGREGADAS AL LOTE CORRECTAMENTE")
                window.location.reload()
            }
            else alert("ERROR AL AGREGAR UNIDADES")
        }
        else alert("ASEGURESE QUE SEA MAYOR A 0")
    }

    const descontarUndLote = async (lote_id : number,ins:number,actuales:number,lnro: string) => {
        const x = prompt("INGRESE CUANTO QUIERES DESCONTAR DEL LOTE: ","0")
        if(x && parseInt(x) && parseInt(x) > 0) {
            const res = await descontarUnidadesLoteFn(lote_id,lnro,parseInt(x),actuales,ins)
            if(res) {
                alert("UNIDADES DESCONTADAS DEL LOTE CORRECTAMENTE")
                window.location.reload()
            }
            else alert("ERROR AL DESCONTAR UNIDADES")
        }
        else alert("ASEGURESE QUE SEA MAYOR A 0")
    }

    const salidaUndLote = async () => {
        const lote = lotes[selectedLote]
        if(cant && cant > 0 && lote && razonLote.length > 0) {
            const res = await salidaUnidadesLoteFn(lote.lote_id,lote.nro,cant,lote.unidades_actuales,selectedI,razonLote)
            if(res) {
                alert("SALIDA DE UNIDADES DEL LOTE CORRECTAMENTE")
                window.location.reload()
            }
            else alert("ERROR AL REALIZAR LA SALIDA DE UNIDADES")
        }
        else alert("ASEGURESE QUE SEA MAYOR A 0 Y TENGA UNA CATEGORIA")
    }

    const bajaLote = async (lote_id : number,ins:number,lnro: string,state:boolean) => {
        const res = await bajaLoteFn(lote_id,lnro,state,ins)
        if(res) {
            alert("LOTE DADO DE BAJA CORRECTAMENTE")
            window.location.reload()
        }
        else alert("ERROR AL DAR DE BAJA EL LOTE")
    }

    const displayLotes = (add: boolean, baja: boolean,desc:boolean) => {
        if(selectedI && !add && !baja && !desc) {
            return(
                <div style={{display:"flex",justifyContent:"start",marginBottom: 35,marginRight: 10,fontSize: 14,maxHeight: 400, overflowY: "scroll"}}>
                    <table style={{width: "100%"}}>
                        <tbody>
                            <tr style={{backgroundColor: "#4A6EE8"}}>
                                <th style={{border: "1px solid"}}>INSUMO</th>
                                <th style={{border: "1px solid"}}>MARCA</th>
                                <th style={{border: "1px solid"}}>NRO LOTE</th>
                                <th style={{border: "1px solid"}}>RNE</th>
                                <th style={{border: "1px solid"}}>RNPA</th>
                                <th style={{border: "1px solid"}}>FECHA ING</th>
                                <th style={{border: "1px solid"}}>FECHA VENC</th>
                                <th style={{border: "1px solid"}}>ESTADO</th>
                                <th style={{border: "1px solid"}}>UNIDADES</th>
                                <th style={{border: "1px solid"}}>UNIDADES ACT</th>
                                <th style={{border: "1px solid"}}>MONTO</th>
                            </tr>
                            {lotes.map((i) => (
                                i.ins_id === selectedI && (
                                    <tr key={i.lote_id} style={{backgroundColor: !i.baja ? "lightgray" : "tomato"}}>
                                        <th style={{border: "1px solid"}}>{i.des}</th>
                                        <th style={{border: "1px solid"}}>{i.nombre}</th>
                                        <th style={{border: "1px solid"}}>{i.nro}</th>
                                        <th style={{border: "1px solid"}}>{i.rne}</th>
                                        <th style={{border: "1px solid"}}>{i.rnpa}</th>
                                        <th style={{border: "1px solid"}}>{i.fecha_ingreso.toISOString().split("T")[0]}</th>
                                        <th style={{border: "1px solid"}}>{i.fecha_vencimiento.toISOString().split("T")[0]}</th>
                                        <th style={{border: "1px solid"}}>{i.estado}</th>
                                        <th style={{border: "1px solid"}}>{i.unidades}</th>
                                        <th style={{border: "1px solid"}}>{i.unidades_actuales}</th>
                                        <th style={{border: "1px solid"}}>{i.monto_factura}</th>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>  
            )
        }
        else if(selectedI && (add || desc)) {
            return(
                <div style={{display:"flex",justifyContent:"start",marginBottom: 35,marginRight: 10,fontSize: 14,maxHeight: 400, overflowY: "scroll"}}>
                    <table style={{width: "70%"}}>
                        <tbody>
                            <tr style={{backgroundColor: "#4A6EE8"}}>
                                <th style={{border: "1px solid"}}>MARCA</th>
                                <th style={{border: "1px solid"}}>NRO LOTE</th>
                                <th style={{border: "1px solid"}}>RNE</th>
                                <th style={{border: "1px solid"}}>RNPA</th>
                                <th style={{border: "1px solid"}}>FECHA ING</th>
                                <th style={{border: "1px solid"}}>FECHA VENC</th>
                                <th style={{border: "1px solid"}}>ESTADO</th>
                                <th style={{border: "1px solid"}}>UNIDADES</th>
                                <th style={{border: "1px solid"}}>UNIDADES ACT</th>
                            </tr>
                            {lotes.map((i) => (
                                (i.ins_id === selectedI && !i.baja) && (
                                    <tr key={i.lote_id} style={{backgroundColor: !i.baja ? "lightgray" : "tomato"}}>
                                        <th style={{border: "1px solid"}}>{i.nombre}</th>
                                        <th style={{border: "1px solid"}}>{i.nro}</th>
                                        <th style={{border: "1px solid"}}>{i.rne}</th>
                                        <th style={{border: "1px solid"}}>{i.rnpa}</th>
                                        <th style={{border: "1px solid"}}>{i.fecha_ingreso.toISOString().split("T")[0]}</th>
                                        <th style={{border: "1px solid"}}>{i.fecha_vencimiento.toISOString().split("T")[0]}</th>
                                        <th style={{border: "1px solid"}}>{i.estado}</th>
                                        <th style={{border: "1px solid"}}>{i.unidades}</th>
                                        <th style={{border: "1px solid"}}>{i.unidades_actuales}</th>
                                        <th><button style={btn_s_style} onClick={() => addUndLote(i.lote_id,i.ins_id,i.unidades_actuales,i.nro)} >+ UND</button></th>
                                        <th><button style={btn_s_style} onClick={() => descontarUndLote(i.lote_id,i.ins_id,i.unidades_actuales,i.nro)} >- UND</button></th>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>  
            )
        }
        else if (selectedI && baja) {
            return(
                <div style={{display:"flex",justifyContent:"start",marginBottom: 35,marginRight: 10,fontSize: 14,maxHeight: 400, overflowY: "scroll"}}>
                    <table style={{width: "70%"}}>
                        <tbody>
                            <tr style={{backgroundColor: "#4A6EE8"}}>
                                <th style={{border: "1px solid"}}>MARCA</th>
                                <th style={{border: "1px solid"}}>NRO LOTE</th>
                                <th style={{border: "1px solid"}}>RNE</th>
                                <th style={{border: "1px solid"}}>RNPA</th>
                                <th style={{border: "1px solid"}}>FECHA ING</th>
                                <th style={{border: "1px solid"}}>FECHA VENC</th>
                                <th style={{border: "1px solid"}}>ESTADO</th>
                                <th style={{border: "1px solid"}}>UNIDADES</th>
                                <th style={{border: "1px solid"}}>UNIDADES ACT</th>
                            </tr>
                            {lotes.map((i) => (
                                (i.ins_id === selectedI) && (
                                    <tr key={i.lote_id} style={{backgroundColor: !i.baja ? "lightgray" : "tomato"}}>
                                        <th style={{border: "1px solid"}}>{i.nombre}</th>
                                        <th style={{border: "1px solid"}}>{i.nro}</th>
                                        <th style={{border: "1px solid"}}>{i.rne}</th>
                                        <th style={{border: "1px solid"}}>{i.rnpa}</th>
                                        <th style={{border: "1px solid"}}>{i.fecha_ingreso.toISOString().split("T")[0]}</th>
                                        <th style={{border: "1px solid"}}>{i.fecha_vencimiento.toISOString().split("T")[0]}</th>
                                        <th style={{border: "1px solid"}}>{i.estado}</th>
                                        <th style={{border: "1px solid"}}>{i.unidades}</th>
                                        <th style={{border: "1px solid"}}>{i.unidades_actuales}</th>
                                        <th><button style={i.baja ? btn_s_style : btn_d_style} onClick={() => bajaLote(i.lote_id,i.ins_id,i.nro,!i.baja)}>{i.baja ? "DAR DE ALTA" : "DAR DE BAJA"}</button></th>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>  
            )
        }
    }

    const uniqAccion = () => {
        if(option) {
            switch (option) {
                case 1:
                    return(
                        <div>
                            <h3 style={{...text_2_t_style}}>INGRESO DE NUEVO LOTE</h3>
                            <div>
                                <h4 style={{...text_2_t_style}}>NRO DE LOTE</h4>
                                <input type="text" style={{textAlign:"center",width: "15%"}} value={loteAdd.nro} onChange={(e) => setLoteAdd({...loteAdd, nro: e.target.value})}/>
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>RNE</h4>
                                <input type="text" style={{textAlign:"center",width: "15%"}} value={loteAdd.rne} onChange={(e) => setLoteAdd({...loteAdd, rne: e.target.value})}/>
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>RNPA</h4>
                                <input type="text" style={{textAlign:"center",width: "15%"}} value={loteAdd.rnpa} onChange={(e) => setLoteAdd({...loteAdd, rnpa: e.target.value})}/>
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>FACTURA</h4>
                                <input type="text" style={{textAlign:"center",width: "15%"}} value={loteAdd.factura} onChange={(e) => setLoteAdd({...loteAdd, factura: e.target.value})}/>
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>MONTO: {convertToMoney(loteAdd.monto_factura)}</h4>
                                <input type="number" style={{textAlign:"left",width: "15%"}} value={loteAdd.monto_factura ? loteAdd.monto_factura : 0} onChange={(e) => setLoteAdd({...loteAdd, monto_factura: parseFloat(e.target.value)})}/>
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>UNIDADES</h4>
                                <input type="number" style={{textAlign:"center",width: "15%"}} value={loteAdd.unidades} onChange={(e) => setLoteAdd({...loteAdd, unidades: parseInt(e.target.value)})}/>
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>FECHA VENCIMIENTO</h4>
                                <input type="date" value={loteAdd.fecha_venc} style={{fontSize: 20}} onChange={(e) => setLoteAdd({...loteAdd, fecha_venc: e.target.value})} />
                            </div>
                            <div>
                                <h4 style={{...text_2_t_style}}>MARCA</h4>
                                <select name="estados_sel" id="state_sl" value={loteAdd.marca_id}
                                onChange={(e) => setLoteAdd({...loteAdd, marca_id: parseInt(e.target.value)})}
                                style={{width: 250,fontSize:18,marginBottom: 20}}>
                                    <option value={0}>---</option>
                                    {marcas.map(m => <option key={m.nombre} value={m.marca_id}>{m.nombre}</option>)}
                                </select>
                            </div>
                            <div style={{marginTop: 25}}>
                                <button style={btn_s_style} onClick={() => createLote()} >INGRESAR LOTE</button>
                            </div>

                        </div>
                    )
                    case 2:
                        return (
                            <div>
                                <h3 style={{...text_2_t_style}}>SELECCIONE EL LOTE</h3>
                                {displayLotes(true,false,false)}
                            </div>
                        )
                    case 3:
                        return (
                            <div>
                                <h3 style={{...text_2_t_style}}>SELECCIONE EL LOTE</h3>
                                {displayLotes(false,true,false)}
                            </div>
                        )
                    case 4:
                        return(
                            <div>
                                <h3 style={{...text_2_t_style}}>SELECCIONE EL LOTE</h3>
                                {displayLotes(true,false,false)}
                            </div>
                        )
                    case 5:
                        return(
                            <button style={{fontSize: 20,backgroundColor: color, borderColor: color, color: "white"}}
                            onClick={() => downLoadExcel()}>
                                <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
                                EXCEL
                            </button>
                        )
                    case 6:
                        return (
                            <div>
                                <div>
                                    <h4 style={{...text_2_t_style}}>RAZON</h4>
                                    <select name="estados_sel" id="state_sl" value={razonLote}
                                    onChange={(e) => setRazonLote(e.target.value)}
                                    style={{width: 250,fontSize:18,marginBottom: 20}}>
                                        <option value={""}>---</option>
                                        {razonesSalida.map((r,i) => <option key={i} value={r}>{r}</option>)}
                                    </select>
                                    <div>
                                        <h3 style={{...text_2_t_style}}>SELECCIONE EL LOTE</h3>
                                        <select name="estados_sel" id="state_sl" value={selectedLote}
                                        onChange={(e) => setSelectedLote(parseInt(e.target.value))}
                                        style={{width: 350,fontSize:18,marginBottom: 20}}>
                                            {lotes.map((l,i) => l.ins_id === selectedI && <option key={i} value={i}>{l.nombre + " - "+l.nro+ " - "+ l.fecha_ingreso.toISOString().split("T")[0]}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <h4 style={{...text_2_t_style}}>UNIDADES</h4>
                                        <input type="number" style={{textAlign:"center",width: "10%"}} value={cant} onChange={(e) => setCant(parseInt(e.target.value))}/>
                                    </div>
                                    <div style={{marginTop: 25}}>
                                        <button style={btn_s_style} onClick={() => salidaUndLote()} >REALIZAR SALIDA</button>
                                    </div>
                                </div>
                            </div>
                        )
                }
        }
    }

    const displayAcciones = () => {
        if(selectedI) {
            return (
                <div>
                    <h2 style={{...text_2_t_style}}>ACCIONES</h2>
                    <div>
                        <select name="estados_sel" id="state_sl" value={option}
                        onChange={(e) => setOption(parseInt(e.target.value))}
                        style={{width: 500,fontSize:24,marginBottom: 20}}>
                            <option value={0}>---</option>
                            {userRol <=3 && <option value={1}>INGRESO DE NUEVO LOTE</option>}
                            {userRol <=2 && <option value={2}>INGRESO SOBRE UN LOTE YA CREADO</option>}
                            {userRol <=2 && <option value={3}>CAMBIAR ESTADO DE LOTE</option>}
                            {userRol <=2 && <option value={4}>DESCONTAR UNIDADES DE UN LOTE</option>}
                            {userRol <=3 && <option value={5}>CONSULTAR MOVIMIENTOS</option>}
                            {userRol <=2 && <option value={6}>SALIDA</option>}
                        </select>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <h2 style={{...text_2_t_style}}>INSUMOS DISPONIBLES</h2>
            <div style={{display:"flex",justifyContent:"start",marginBottom: 35,marginRight: 10,fontSize: 14}}>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "8%"}}>COD 1</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 2</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 3</th>
                            <th style={{border: "1px solid", width: "40%"}}>DESCRIPCION</th>
                            <th style={{border: "1px solid", width: "20%"}}>STOCK FISICO</th>
                            <th style={{border: "1px solid", width: "20%"}}>CAJAS</th>
                            <th style={{border: "1px solid", width: "20%"}}>PALETS</th>
                        </tr>
                        {insumos.map((i) => (
                        <tr key={i.ins_id} style={{backgroundColor: i.visible ? "lightgray" : "tomato"}}>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod1}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod2}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod3}</th>
                            <th style={{border: "1px solid", width: "40%"}}>{i.des}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{i.stock_lote ? i.stock_lote : 0}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{cajasCalc(i.stock_lote,i.unidades_caja)}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{paletsCalc(i.stock_lote,i.unidades_caja,i.caja_palet)}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2 style={{...text_2_t_style}}>INSUMOS DADOS DE BAJA</h2>
            {insumosB.length > 0 && (
            <div style={{display:"flex",justifyContent:"start",marginBottom: 35,marginRight: 10,fontSize: 14}}>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "8%"}}>COD 1</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 2</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 3</th>
                            <th style={{border: "1px solid", width: "40%"}}>DESCRIPCION</th>
                            <th style={{border: "1px solid", width: "20%"}}>STOCK FISICO</th>
                            <th style={{border: "1px solid", width: "20%"}}>CAJAS</th>
                            <th style={{border: "1px solid", width: "20%"}}>PALETS</th>
                        </tr>
                        {insumosB.map((i) => (
                        <tr key={i.ins_id} style={{backgroundColor: i.visible ? "lightgray" : "tomato"}}>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod1}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod2}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod3}</th>
                            <th style={{border: "1px solid", width: "40%"}}>{i.des}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{i.stock_lote ? i.stock_lote : 0}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{cajasCalc(i.stock_lote,i.unidades_caja)}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{paletsCalc(i.stock_lote,i.unidades_caja,i.caja_palet)}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
            <h2 style={{...text_2_t_style}}>LOTES</h2>
            <div>
                <h3 style={{...text_2_t_style}}>SELECCIONA UN INSUMO A CONSULTAR</h3>
                <select name="estados_sel" id="state_sl"
                onChange={(e) => setSelectedI(parseInt(e.target.value))}
                style={{width: 500,fontSize:24,marginBottom: 20}}>
                    <option value={0}>---</option>
                    {insumos.map((ins) => (
                        <option key={ins.ins_id} value={ins.ins_id}>{ins.des}</option>
                    ))}
                </select>
            </div>
            {displayLotes(false,false,false)}
            {displayAcciones()}
            {uniqAccion()}
        </div>
    )
}