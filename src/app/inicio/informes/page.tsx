import EnviosExcel from "@/Componets/EnviosExcel";
import DBEnviosExcel from "@/db/DBEnviosExcel";
import { IEnviosExcel } from "@/utils/interfaces";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";



export default async function Page() {
    await sessionCheck(3)


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

    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>INFORMES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <h2 style={text_2_t_style}>ENVIOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
                <div style={{display:"flex",justifyContent:"center"}}>
                    <EnviosExcel getDataExcelFn={getEnviosData}/>
                </div>
            </div>
        </div>
    )
}