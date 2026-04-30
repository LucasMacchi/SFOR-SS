import RetirosDisplay from "@/Componets/RetirosDisplay"
import DBReportesCall from "@/db/DBReportesCall"
import DBResolverReporte from "@/db/DBResolverReporte"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Reportes() {
    await sessionCheck(2)
    const reportes = await DBReportesCall()

    const resolverReporteFn = async (reporte_id : number,solucion:string,respuesta:string): Promise<boolean> => {
        "use server"
        try {
            const res = await DBResolverReporte(reporte_id,solucion,respuesta)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div>
            <div>
                <h2 style={text_2_t_style}>REPORTES DE LLAMADAS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <RetirosDisplay reports={reportes} 
                resolverReporteFn={resolverReporteFn}/>
            </div>
        </div>
    )
}