import DesgloseDisplay from "@/Componets/DesgloseDisplay";
import DBDesgloseDisplayer from "@/db/DBDesgloseDisplayer";
import DBUniqRemito from "@/db/DBUniqRemito";
import refillEmptySpace from "@/utils/refillEmptySpace";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";
import { redirect } from "next/navigation";


export default async function Page({params}:{params:Promise<{remito:string}>}) {
    await sessionCheck()
    const remitoUrl = (await params).remito
    const remitoUniq = await DBUniqRemito(remitoUrl)
    if(!remitoUniq){
        alert("No se pudo traer los datos del remito.")
        redirect("/inicio")
    }
    const remitoDetalles = await DBDesgloseDisplayer(remitoUniq.remito_id)
    const parseRemitoToString = (pv:number,num:number):string => {
        return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
    }
    const fechaEntre = remitoUniq.fecha_entregado ? remitoUniq.fecha_entregado.toISOString().split("T")[0] : "NaN"
    const fechaPrep = remitoUniq.fecha_preparado ? remitoUniq.fecha_preparado.toISOString().split("T")[0] : "NaN"
    const fechaDesp = remitoUniq.fecha_despachado ? remitoUniq.fecha_despachado.toISOString().split("T")[0] : "NaN"
    const fechaProcs = remitoUniq.fecha_creado.toISOString().split("T")[0]
    const fact = remitoUniq.numf && remitoUniq.pvf ? refillEmptySpace(5,remitoUniq.pvf)+"-"+refillEmptySpace(8,remitoUniq.numf) : "NaN"
    const tipo = remitoUniq.fortificado ? "ALMUERZO FORTIFICADO" : "COPA DE LECHE"
    const lugarEntreg = remitoUniq.lentrega_id+" - "+remitoUniq.departamento+", "+remitoUniq.localidad
    return(
        <div style={{marginBottom: 200}}>
            <div style={{display: "flex",justifyContent: "center"}}>
                <h1 style={text_2_t_style}>REMITO {parseRemitoToString(remitoUniq.pv,remitoUniq.numero)}</h1>
            </div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <h4 style={text_2_t_style}>{remitoUniq.cabecera}</h4>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div style={{marginLeft: 50,marginTop: 40}}>
                <div style={{width: "50%",borderRightWidth: "1px"}}>
                    <h2 style={text_2_t_style}>ESTADO: {remitoUniq.estado}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE PROCESO: {fechaProcs}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE PREPARADP: {fechaPrep}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE DESPACHO: {fechaDesp}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE ENTREGA: {fechaEntre}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FACTURACION: {fact}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>DIAS DE COBERTURA: {remitoUniq.dias}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>TIPO DE REMITO: {tipo}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>LUGAR: {lugarEntreg}</h2>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>CANTIDAD DE REPORTES: {remitoUniq.reportes}</h2>
                </div>
                <div style={{marginTop: 65}}>
                    <div>
                        <h1 style={text_2_t_style}>DETALLES</h1>
                    </div>
                    <hr color="#4A6EE8" style={hr_style}/>
                    {remitoDetalles && <DesgloseDisplay envios={remitoDetalles}/>}
                </div>
            </div>
        </div>
    )
}