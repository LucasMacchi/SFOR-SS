import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import { createReporteSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IRqReportAdd } from "@/utils/interfaces";

export default async function (data: IRqReportAdd): Promise<void> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            await conn.connect()
            const sql = createReporteSQL(data,user.userId)
            console.log(sql)
            await conn.query(sql)
        }
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear reporte en la base de datos")
    }
}