import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { resolverReporteSQL } from "./SQLreturner"


export default async function (reporteId: number,solucion:string,respuesta:string): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            await conn.query(resolverReporteSQL(),[reporteId,respuesta,solucion])
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al resolver reporte de llamada.")
    }
}