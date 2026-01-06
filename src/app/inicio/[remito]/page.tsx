import DeleteRemito from "@/Componets/DeleteRemito";
import DesgloseDisplay from "@/Componets/DesgloseDisplay";
import RemitoInsumosDisplay from "@/Componets/RemitoInsumosDisplay";
import RemitoUniqPdf from "@/Componets/RemitoUniqPdf";
import ReporteAdd from "@/Componets/ReporteAdd";
import ReportesDisplay from "@/Componets/ReportesDisplay";
import StateChangeDisplay from "@/Componets/StateChangeDisplay";
import DBDeleteRemito from "@/db/DBDeleteRemito";
import DBDesgloseDisplayer from "@/db/DBDesgloseDisplayer";
import DBEstados from "@/db/DBEstados";
import DBGeneralData from "@/db/DBGeneralData";
import DBInsumos from "@/db/DBInsumos";
import DBReportCategorias from "@/db/DBReportCategorias";
import DBReportes from "@/db/DBReportes";
import DBUniqRemito from "@/db/DBUniqRemito";
import decodeJWT from "@/utils/decodeJWT";
import refillEmptySpace from "@/utils/refillEmptySpace";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";
import { redirect } from "next/navigation";


export default async function Page({params}:{params:Promise<{remito:string}>}) {
    await sessionCheck(3)
    const remitoUrl = (await params).remito
    const remitoUniq = await DBUniqRemito(remitoUrl)
    const estados = await DBEstados()
    const categorias = await DBReportCategorias()
    const insumos = await DBInsumos()
    const configTable = await DBGeneralData()
    
    if(!remitoUniq){
        alert("No se pudo traer los datos del remito.")
        redirect("/inicio")
    }
    
    const reportes = await DBReportes(remitoUniq.remito_id)
    
    const remitoDetalles = await DBDesgloseDisplayer(remitoUniq.remito_id)
    
    let opt = ""
    const regCeliaco = /\CEALIQUIA\b/
    const regCeliaco2 = /\CELIAQUIA\b/
    const regDiabetes = /\DIABETES\b/
    const regMixto = /\MIXTO\b/
    if(remitoDetalles) {
        remitoDetalles.forEach(e => {
            if(regDiabetes.test(e.dependencia)) opt = "UNA CAJA POR BENEFICIARIO DIETA ESPECIAL DIABETES."
            if(regCeliaco.test(e.dependencia) || regCeliaco2.test(e.dependencia)) opt = "UNA CAJA POR BENEFICIARIO DIETA ESPECIAL CELIAQUIA."
            if(regMixto.test(e.dependencia)) opt = "UNA CAJA POR BENEFICIARIO DIETA ESPECIAL MIXTO."
        });
    }


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
    
    const venc = configTable ? configTable.configVariables[1].payload: "NAN"
    
    const cai = configTable ? configTable.configVariables[0].payload: "NAN"

    const user = await decodeJWT()

    const deleteRemito = async ():Promise<boolean> => {
        "use server"
        try {
            await DBDeleteRemito(remitoUniq.remito_id)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div style={{marginBottom: 200}}>
            <div style={{display: "flex",justifyContent: "center"}}>
                <h1 style={text_2_t_style}>REMITO {parseRemitoToString(remitoUniq.pv,remitoUniq.numero)}</h1>
            </div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <h4 style={text_2_t_style}>{remitoUniq.cabecera}</h4>
            </div>
            <div style={{display: "flex"}}>
                <div>
                    <RemitoUniqPdf insumos={insumos} remito={remitoUniq} detalles={remitoDetalles ? remitoDetalles : [] } venc={venc} cai={cai} especial={opt}/>
                </div>
                <div style={{marginLeft: 10, alignItems: "baseline"}}>
                    {(user && user.rol === 1) && <DeleteRemito deleteFn={deleteRemito}/>}
                </div>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div style={{marginLeft: 50,marginTop: 40}}>
                <div style={{display: "flex"}}>
                    <div style={{width: "50%",borderRightWidth: "1px"}}>
                        <h2 style={text_2_t_style}>ESTADO: {remitoUniq.estado}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE PROCESO: {fechaProcs}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE PREPARADO: {fechaPrep}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE DESPACHO: {fechaDesp}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE ENTREGA: {fechaEntre}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>FACTURACION: {fact}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>DIAS DE COBERTURA: {remitoUniq.dias}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>TIPO DE REMITO: {tipo}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>LUGAR: {lugarEntreg}</h2>
                        <h2 style={{...text_2_t_style, marginTop: 40}}>CANTIDAD DE REPORTES: {remitoUniq.reportes}</h2>
                    </div>
                    <div>
                        <RemitoInsumosDisplay desgloses={remitoDetalles  ? remitoDetalles : [] } insumos={insumos}/>
                    </div>
                </div>

                <div style={{marginTop: 65}}>
                    <div>
                        <h1 style={text_2_t_style}>ESTADOS</h1>
                    </div>
                    <hr color="#4A6EE8" style={hr_style}/>
                    <StateChangeDisplay remito={remitoUniq} estados={estados}/>
                </div>
                <div style={{marginTop: 65}}>
                    <div>
                        <h1 style={text_2_t_style}>REPORTES</h1>
                    </div>
                    <hr color="#4A6EE8" style={hr_style}/>
                    <div style={{display: "flex", justifyContent: "space-around"}}>
                        <div style={{width: "35%"}}>
                            <ReportesDisplay reportes={reportes}/>
                        </div>
                        <div style={{width: "50%"}}>
                            <ReporteAdd categorias={categorias} remito={remitoUniq.remito_id}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: 65}}>
                    <div>
                        <h1 style={text_2_t_style}>DETALLES</h1>
                    </div>
                    <hr color="#4A6EE8" style={hr_style}/>
                    {remitoDetalles && <DesgloseDisplay envios={remitoDetalles}/>}
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}