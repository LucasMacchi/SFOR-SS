"use client"
import { IReporteRetiro } from "@/utils/interfaces"
import { btn_s_style, hr_style, text_2_t_style } from "@/utils/styles"
import { useState } from "react"


export default function RetirosDisplay({reports,resolverReporteFn}:{reports:IReporteRetiro[],resolverReporteFn: (reporte_id : number,solucion:string,respuesta:string) => Promise<boolean>}) {

    const [filteredReportes,setFilteredReportes] = useState<IReporteRetiro[]>(reports)
    const [selectedReporte, setSelectedReporte] = useState<number>(-1)
    const [solucion, setSolucion] = useState<string>("")

    const resolverReporte = async () => {
        if(selectedReporte !== -1 && solucion.length > 10 && confirm("¿Desea resolver este reporte?")) {
            const reporteID = filteredReportes[selectedReporte].preg_id
            const respuesta_1 = filteredReportes[selectedReporte].respuesta + " - CANTIDAD: " + filteredReportes[selectedReporte].respuesta_2
            const res = await resolverReporteFn(reporteID,solucion,respuesta_1)
            if(res) {
                alert("Reporte resuelto con éxito.")
                setFilteredReportes(filteredReportes.filter(r => r.preg_id !== reporteID))
                setSelectedReporte(-1)
                setSolucion("")
            }
            else alert("Error al resolver reporte.")
        }
        else alert("Seleccione un reporte para resolver.")
    }

    return(
        <div style={{marginBottom: 100}}>
            <div>
                <h2 style={text_2_t_style}>REPORTES</h2>
            </div>
            <div style={{maxHeight: 250,height:250,width: "95%", overflow: "scroll"}}>
                {filteredReportes.length > 0 ? 
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 15}}>ID ENT.</th>
                            <th style={{border: "1px solid", fontSize: 15}}>CABECERA</th>
                            <th style={{border: "1px solid", fontSize: 15}}>DEPENDENCIA</th>
                            <th style={{border: "1px solid", fontSize: 15}}>FECHA LLAMADA</th>
                            <th style={{border: "1px solid", fontSize: 15}}>DEPARTAMENTO</th>
                            <th style={{border: "1px solid", fontSize: 15}}>LOCALIDAD</th>
                        </tr>
                        {filteredReportes.map((d,i) => (
                        <tr key={i} style={{backgroundColor: selectedReporte === i ? "Highlight" : "white"}}
                        onClick={() => setSelectedReporte(i)}>
                            <th style={{border: "1px solid", fontSize: 15}}>{d.lentrega_id}</th>
                            <th style={{border: "1px solid", fontSize: 15}}>{d.completo}</th>
                            <th style={{border: "1px solid", fontSize: 15}}>{d.des}</th>
                            <th style={{border: "1px solid", fontSize: 15}}>{d.fecha.toISOString().split('T')[0] || "N/A"}</th>
                            <th style={{border: "1px solid", fontSize: 15}}>{d.departamento}</th>
                            <th style={{border: "1px solid", fontSize: 15}}>{d.localidad}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                :
                <h2 style={text_2_t_style}>NO HAY NINGUN REPORTE DISPONIBLE</h2>
                }
            </div>
            {selectedReporte !== -1 && (
                <div style={{marginTop: 20}}>
                    <h2 style={text_2_t_style}>DETALLES DEL REPORTE</h2>
                    <hr color="#4A6EE8" style={hr_style}/>
                    <div style={{marginTop: 20}}>
                        <h3 style={{...text_2_t_style,marginTop:20}}>ESCUELA: {filteredReportes[selectedReporte].des}</h3>
                        <h3 style={{...text_2_t_style,marginTop:20}}>TIPO: {filteredReportes[selectedReporte].pregunta}</h3>
                        <h3 style={{...text_2_t_style,marginTop:20}}>INSUMO: {filteredReportes[selectedReporte].respuesta}</h3>
                        <h3 style={{...text_2_t_style,marginTop:20}}>CANTIDAD: {filteredReportes[selectedReporte].respuesta_2}</h3>
                    </div>
                    <h3 style={{...text_2_t_style,marginTop:20}}>INGRESE UNA DESCRIPCION DE LA SOLUCION (MINIMO 10 CARACTERES)</h3>
                    <textarea
                        placeholder="Ingrese la solución del reporte..."
                        value={solucion}
                        onChange={(e) => setSolucion(e.target.value)}
                        style={{height: 100,width: "40%",resize: "none"}}
                    />
                    <div>
                        <button style={{...btn_s_style,marginLeft:5,marginTop: 10}} onClick={() => resolverReporte()}>RESOLVER REPORTE</button>
                    </div>
                </div>
            )}
        </div>
    )
}