import EnviosExcel from "@/Componets/EnviosExcel";
import FacturasExcel from "@/Componets/FacturasExcel";
import ViajesExcel from "@/Componets/ViajesExcel";
import DBEnviosExcel from "@/db/DBEnviosExcel";
import DBFacturacion from "@/db/DBFacturacion";
import DBValorRacion from "@/db/DBValorRacion";
import DBViajes from "@/db/DBViajes";
import DBViajesExcel from "@/db/DBViajesExcel";
import { IEnviosExcel, IExcelFactura, IRemitoInFactura, IRemitoNoExportedRQ, IViajeExcel, IViajeExcelComplete, IViajeExcelCompleteInsumos, IViajeRemitoDetalleExcel } from "@/utils/interfaces";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";
import parseRemitoString from "@/utils/parseRemitoString";
import ViajesExcelDiv from "@/Componets/ViajesExcelDiv";
import DBInsumos from "@/db/DBInsumos";
import viajeInsumosParseDisplay from "@/utils/viajeInsumosParseDisplay";
import DBPlanReparto from "@/db/DBPlanReparto";
import ViajesExcelData from "@/Componets/ViajesExcelData";
import ViajesExcelDataCombinado from "@/Componets/ViajeExcelDataCombinado";
import ExportRemitos from "@/Componets/ExportRemitos";
import DBExportData from "@/db/DBExportData";
import DBExportRemito from "@/db/DBExportRemito";



export default async function Page() {
    await sessionCheck(3)
    const viajes = await DBViajes()

    const getEnviosData = async () => {
        "use server"
        try {
            const res = await DBEnviosExcel()
            const excelData: IEnviosExcel[] = res.map((e) => {
                return{
                    R_PV:e.pv,
                    R_NUMERO:e.numero,
                    R_CREADO:e.fecha_creado.toISOString().split("T")[0],
                    R_PREPARADO:e.fecha_preparado ? e.fecha_preparado.toISOString().split("T")[0] : "NaN",
                    R_DESPACHADO:e.fecha_despachado ? e.fecha_despachado.toISOString().split("T")[0] : "NaN",
                    R_ENTREGADO:e.fecha_entregado ? e.fecha_entregado.toISOString().split("T")[0] : "NaN",
                    R_TIPO:e.fortificado ? "ALMUERZO" : "COPA DE LECHE",
                    R_ESTADO:e.estado,
                    E_DEPENDENCIA:e.dependencia,
                    E_ID_ENTREGA:e.lugar_entrega
                }
            })
            return excelData
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const getAllFacturas = async ():Promise<IExcelFactura[]> => {
        "use server"
        try {
            const facturas = await DBFacturacion()
            const valRac = await DBValorRacion()
            const data: IExcelFactura[] = []
            if(facturas){
                console.log("aca")
                facturas.forEach(f => {
                    f.remitos?.forEach((rt) => {
                        if(rt){
                            data.push({
                                REMITO: parseRemitoString(rt.pv,rt.numero),
                                RACIONES: rt.raciones,
                                CABECERA: rt.completo,
                                MONTO: rt.raciones * valRac,
                                FACTURA: parseRemitoString(f.pv,f.numero),
                                LOCALIDAD: rt.localidad,
                                DEPARTAMENTO: rt.departamento
                            })
                        }
                    })
                });

                return data
            }

            return []
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const getViajesData = async ():Promise<IViajeExcelComplete[]> => {
        "use server"
        try {
            const res = await DBViajesExcel()
            const viajesExcel:IViajeExcelComplete[] = []
            viajes.forEach(v => {
                const excelData: IViajeExcel[] = []
                res.forEach(e => {
                    if(e.viaje_id === v.viaje_id) {
                        excelData.push({
                            CUE:e.cue,
                            ID: e.lentrega_id,
                            CABECERA:e.completo,
                            DEPENDENCIA:e.dependencia,
                            LOCALIDAD:e.localidad,
                            DEPARTAMENTO:e.departamento,
                            DIRECCION:e.direccion,
                            DIAS:e.dias,
                            PLAN:e.plan,
                            RACIONES:e.raciones,
                            RACIONES_TOTAL:e.raciones * e.dias
                        })
                    }
                });
                viajesExcel.push({
                    name: v.des,
                    detalles: excelData
                })
            });

            return viajesExcel
        } catch (error) {
            console.log(error)
            return []
        }
    }


    const getViajesDataDivided = async ():Promise<IViajeExcel[]> => {
        "use server"
        try {
            const res = await DBViajesExcel()
            const excelData: IViajeExcel[] = []
            viajes.forEach(v => {
                res.forEach(e => {
                    if(e.viaje_id === v.viaje_id) {
                        excelData.push({
                            CUE:e.cue,
                            ID: e.lentrega_id,
                            CABECERA:e.completo,
                            DEPENDENCIA:e.dependencia,
                            LOCALIDAD:e.localidad,
                            DEPARTAMENTO:e.departamento,
                            DIRECCION:e.direccion,
                            DIAS:e.dias,
                            PLAN:e.plan,
                            RACIONES:e.raciones,
                            RACIONES_TOTAL:e.raciones * e.dias,
                            VIAJE: v.des
                        })
                    }
                });
            });

            return excelData
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const getViajesDataProcesed = async () => {
        "use server"
        try {
            const viajes = await DBViajes()
            const insumos = await DBInsumos()
            const planes = await DBPlanReparto()
            const viajesExcel:IViajeExcelCompleteInsumos[] = []
            viajes.forEach(v => {
                const detalles = viajeInsumosParseDisplay(insumos,planes ? planes : [],v.remitos)
                const excelDet:IViajeRemitoDetalleExcel[] = detalles.map((dt) => {
                    return{
                        UNIDADES:dt.unidades,
                        BOLSAS: dt.bolsas,
                        RACIONES: dt.raciones,
                        CAJAS: dt.cajas,
                        INSUMO:dt.des,
                        KILOS: dt.kilos
                    }
                })
                viajesExcel.push({
                    name: v.des,
                    detalles: excelDet
                })
            });
            return viajesExcel
        } catch (error) {
            console.log(error)
            return []
        }
    }
    const getViajesDataProcesedCombinado = async () => {
        "use server"
        try {
            const viajes = await DBViajes()
            const insumos = await DBInsumos()
            const planes = await DBPlanReparto()
            const excelDet:IViajeRemitoDetalleExcel[] = []
            viajes.forEach(v => {
                const detalles = viajeInsumosParseDisplay(insumos,planes ? planes : [],v.remitos)
                detalles.forEach(dt => {
                    excelDet.push({
                        UNIDADES:dt.unidades,
                        BOLSAS: dt.bolsas,
                        RACIONES: dt.raciones,
                        CAJAS: dt.cajas,
                        INSUMO:dt.des,
                        KILOS: dt.kilos,
                        VIAJE: v.des
                    })
                });
            });
            return excelDet
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const getExportData = async () => {
        "use server"
        try {
            const exportar = await DBExportData()
            return exportar
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const exportRemitos = async (remitos: IRemitoNoExportedRQ[]): Promise<boolean> => {
        "use server"
        try {
            const resEnd = await DBExportRemito(remitos)
            return resEnd
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>INFORMES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <h2 style={text_2_t_style}>REMITOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <ExportRemitos getExportData={getExportData} exportarRemitos={exportRemitos}/>
                </div>
            </div>
            <div>
                <h2 style={text_2_t_style}>ENVIOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <EnviosExcel getDataExcelFn={getEnviosData}/>
                </div>
            </div>
            <div>
                <h2 style={text_2_t_style}>VIAJES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <ViajesExcel getViajeDataExcelFn={getViajesData}/>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop: 20}}>
                    <ViajesExcelDiv getViajeDataExcelDivFn={getViajesDataDivided}/>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop: 20}}>
                    <ViajesExcelData getViajesDataProcesed={getViajesDataProcesed}/>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop: 20}}>
                    <ViajesExcelDataCombinado getViajesDataProcesedCombinado={getViajesDataProcesedCombinado}/>
                </div>
            </div>
            <div>
                <h2 style={text_2_t_style}>FACTURACION</h2>
                <hr color="#4A6EE8" style={hr_style}/>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <FacturasExcel getFacturasDataExcelFn={getAllFacturas}/>
                </div>
            </div>
        </div>
    )
}


