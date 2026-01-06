"use client"

import { IEnvioDetallesParsed, IInsumo, IRemitoT, IViajeRQ } from "@/utils/interfaces"
import refillEmptySpace from "@/utils/refillEmptySpace"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { CSSProperties, useEffect, useState } from "react"
import PdfBtn from "./PdfBtn"
import PDFRemitos from "./pdfs/PDFRemitos"
import { pdf } from "@react-pdf/renderer"
import PDFDesglose from "./pdfs/PDFDesglose"
import PDFActas from "./pdfs/PDFActas"
import hojarutaParsed from "@/utils/hojarutaParsed"
import PDFHojaRuta from "./pdfs/PDFHojaRuta"


export default function TraerRemitosDisplay ({viajes,insumos,venc,cai,getRtViaje,getRtRango}:
    {viajes:IViajeRQ[],insumos:IInsumo[],venc:string,cai:string,getRtViaje: (viaje:number) => Promise<IRemitoT[]>,getRtRango: (start:number,end:number) => Promise<IRemitoT[]>}) {

    const inputRtStyle: CSSProperties = {
        height: 25,
        borderRadius: 4,
        fontSize: 20,
        width: 120
    }
    const [option,setOption] = useState(0)
    const [selectedViaje,setSelectedViaje] = useState(-1)
    const [remitos, setRemitos] = useState<IRemitoT[]>([])
    const [range, setRange] = useState({start:0,end:0})
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        setSelectedViaje(-1)
        setRemitos([])
        setRange({start:0,end:0})
    },[option])

    const downloadRemitos = async ():Promise<Blob> => {
        const remits = remitos
        const blob = await pdf(<PDFRemitos remito={remits} insumos={insumos}
        venc={venc} cai={cai}/>).toBlob()
        return blob
    }

    const downloadDesglose = async ():Promise<Blob> => {
        const remits = remitos
        const blob = await pdf(<PDFDesglose insumos={insumos} remitos={remits} />).toBlob()
        return blob
    }

    const downloadActas = async ():Promise<Blob> => {
        const remits = remitos
        const blob = await pdf(<PDFActas remitos={remits} />).toBlob()
        return blob
    }

    const downloadHojaRuta = async () => {
        const remits = remitos
        const detalles:IEnvioDetallesParsed[] = hojarutaParsed(insumos,remits)
        const blob = await pdf(<PDFHojaRuta detalles={detalles} remitos={remits} />).toBlob()
        return blob
    }

    const displayViaje = () => {

        const getRemitosByViaje = async () => {
            if(viajes[selectedViaje].viaje_id) {
                const res = await getRtViaje(viajes[selectedViaje].viaje_id)
                if(res.length > 0) setRemitos(res)
                else alert("No existen remitos en este viaje.")

            }
        }
        return(
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL PLAN</h2>
                    <select name="estados_sel" id="state_sl" value={selectedViaje}
                    onChange={(e) => setSelectedViaje(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {viajes.map((p,i) => {
                            if(p.remitos.length > 0 && p.procesado) {
                                return <option key={i} value={i}>{p.des}</option>
                            }
                        })}
                    </select>
                </div>
                {(selectedViaje > -1 && viajes[selectedViaje]) && 
                    <div>
                        <button style={btn_s_style} onClick={() => getRemitosByViaje()}>
                            TRAER REMITOS
                        </button>
                    </div>
                }
            </div>
        )
    }

    const displayRangos = () => {
        const getRemitosByRango = async () => {
            if(range.start && range.end && range.end > range.start) {
                const res = await getRtRango(range.start,range.end)
                if(res.length > 0) setRemitos(res)
                else alert("No existen remitos en este rango.")
            }
        }
        return(
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>INGRESE EL PRIMER Y ULTIMO REMITO A CONSULTAR</h2>
                    <div style={{display:"flex",justifyContent:"space-between",width: "20%", marginTop:20}}>
                        <input style={inputRtStyle} type="number" value={refillEmptySpace(8,range.start)} onChange={(e) => setRange({...range, start: parseInt(e.target.value)})}/>
                        <input style={inputRtStyle} type="number" value={refillEmptySpace(8,range.end)} onChange={(e) => setRange({...range, end: parseInt(e.target.value)})}/>
                    </div>
                </div>
                {(range.start && range.end && range.end > range.start) ?
                    <div style={{marginTop: 20, display: "flex",justifyContent: "center",width: "20%"}}>
                        <button style={btn_s_style} onClick={() => getRemitosByRango()}>
                            CONSULTAR REMITOS
                        </button>
                    </div>
                :
                <div>
                    <h4 style={{...text_2_t_style, marginTop: 40}}>INGRESE EL RANGO DE REMITOS</h4>
                </div>
                }
            </div>
        )
    }

    return (
        <div>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA LA OPCION</h2>
                <select name="estados_sel" id="state_sl" value={option}
                onChange={(e) => setOption(parseInt(e.target.value))}
                style={{width: 500,fontSize:24,marginBottom: 20}}>
                    <option value={0}>---</option>
                    <option value={1}>CONSULTAR POR VIAJE</option>
                    <option value={2}>CONSULTAR POR RANGO</option>
                </select>
            </div>
            {option === 1 && displayViaje()}
            {option === 2 && displayRangos()}
            {(remitos.length > 0 && !loading) && 
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>REMITOS TOTALES - {remitos.length}</h2>
                    <div style={{display:"flex",justifyContent:"space-evenly",width:"50%"}}>
                        <PdfBtn disable={false} title="REMITOS" pdf={downloadRemitos()}/>
                        <PdfBtn disable={false} title="DESGLOSES" pdf={downloadDesglose()}/>
                        <PdfBtn disable={false} title="ACTAS" pdf={downloadActas()}/>
                        <PdfBtn disable={false} title="HOJA DE RUTA" pdf={downloadHojaRuta()}/>
                    </div>

                </div>
                <div style={{maxHeight: 300,height:300,overflow:"scroll",width: "50%",marginTop:20}}>
                <table style={{width: "100%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8",color:"white"}}>
                            <th style={{border: "1px solid", width: "10%"}}>NRO</th>
                            <th style={{border: "1px solid", width: "80%"}}>CABECERA</th>
                            <th style={{border: "1px solid", width: "10%"}}>DESGLOSES</th>
                        </tr>
                        {remitos.map((r,i) => (
                            <tr key={i}>
                                <th style={{border: "1px solid", width: "10%"}}>{r.numero}</th>
                                <th style={{border: "1px solid", width: "80%",textAlign: "left"}}>{r.completo}</th>
                                <th style={{border: "1px solid", width: "20%"}}>{r.envios.length}</th>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                </div>
            </div>

            }
        </div>
    )
}