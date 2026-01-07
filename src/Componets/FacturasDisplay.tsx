"use client"

import { IExcelFactura, IFacturaAgrupado, IRemitoInFactura } from "@/utils/interfaces"
import { text_2_t_style } from "@/utils/styles"
import { useState } from "react"
import refillEmptySpace from "@/utils/refillEmptySpace";
import convertToMoney from "@/utils/convertToMoney";
import ExcelBtn from "./ExcelBtn";
import PdfBtn from "./PdfBtn";
import PDFfactura from "./pdfs/PDFfactura";
import { pdf } from "@react-pdf/renderer";


export default function FacturasDisplay ({facturas,valor}:{facturas:IFacturaAgrupado[],valor:number}) {
    
    const [selectedF, setSelectedF] = useState(0)
    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }
    const excelNameReturner = () => {
        if(facturas[selectedF]) return "F "+parseRemitoToString(facturas[selectedF].pv,facturas[selectedF].numero)
        else return 'FACTURAS'
    }
    const excelDataReturner = () => {
        if(facturas[selectedF] && facturas[selectedF].remitos) {
            const data: IExcelFactura[] = []
            facturas[selectedF].remitos.forEach(rt => {
                data.push({
                    REMITO: parseRemitoToString(rt.pv,rt.numero),
                    RACIONES: rt.raciones,
                    MONTO: rt.monto,
                    CABECERA: rt.completo,
                    LOCALIDAD: rt.localidad,
                    DEPARTAMENTO: rt.departamento
                })
            });
            return data
        }
        else {
            const allRts: IRemitoInFactura[] = []
            facturas.forEach(f => {
                if(f.remitos) {
                    f.remitos.forEach(r => {
                        r.factura = parseRemitoToString(f.pv,f.numero)
                        allRts.push(r)
                    });
                }
            })
            const data: IExcelFactura[] = []
            allRts.forEach(rt => {
                data.push({
                    REMITO: parseRemitoToString(rt.pv,rt.numero),
                    RACIONES: rt.raciones,
                    CABECERA: rt.completo,
                    MONTO: rt.monto,
                    FACTURA: rt.factura ? rt.factura : "",
                    LOCALIDAD: rt.localidad,
                    DEPARTAMENTO: rt.departamento
                })
            });
            return data
        }
    }
    const downloadPdf = async ():Promise<Blob> => {
        const blob = await pdf(<PDFfactura valor={valor} factura={facturas[selectedF]}/>).toBlob()
        return blob
    }
    return (
        <div style={{marginBottom: 50}}>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA LA FACTURA</h2>
                <select name="estados_sel" id="state_sl" value={selectedF}
                onChange={(e) => setSelectedF(parseInt(e.target.value))}
                style={{width: 450,fontSize:24,marginBottom: 20}}>
                    <option value={-1}>---</option>
                    {facturas.map((f,i) => (
                        <option key={i} value={i}>{parseRemitoToString(f.pv,f.numero)}</option>
                    ))}
                </select>
            </div>
            <div style={{height: 450,overflow: "scroll"}}>
                {selectedF > -1 && facturas[selectedF].remitos ? 
                <table style={{width: "100%", maxHeight: 400}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>REMITO</th>
                            <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                        </tr>
                        {facturas[selectedF].remitos.map((d,i) => (
                        <tr key={i}>
                            <th style={{border: "1px solid", fontSize: 20}}>{parseRemitoToString(d.pv,d.numero)}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                :
                <h2 style={text_2_t_style}>SELECCIONE UNA FACTURA PARA VER EL DETALLE</h2>
                }
            </div>
            {selectedF > -1 && <h2 style={text_2_t_style}>TOTAL DE REMITOS: {facturas[selectedF].remitos?.length}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>SUMA TOTAL DE RACIONES: {facturas[selectedF].raciones}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>SUMA TOTAL MONETARIA: {convertToMoney(facturas[selectedF].monto)}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>FECHA DE FACTURA: {facturas[selectedF].fecha_factura.toISOString().split("T")[0]}</h2>}
            {selectedF > -1 && <h2 style={text_2_t_style}>ESTADO: {facturas[selectedF].cerrado ? "CERRADA" : "ABIERTA"}</h2>}
            <div style={{display: "flex",justifyContent:"start"}}>
                <ExcelBtn title={selectedF > -1 ? "FACTURA" : "FACTURAS"} disable={false} name={excelNameReturner()} page="factura" data={excelDataReturner()}/>
                <div style={{marginLeft: 10}}>
                    <PdfBtn title="FACTURA" disable={selectedF > -1 ? false : true} pdf={downloadPdf()}/>
                </div>
            </div>
        </div>
    )
}