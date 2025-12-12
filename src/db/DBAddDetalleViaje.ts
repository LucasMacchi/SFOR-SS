import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import { addDetalleViajeSQL, planAddDetailSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddPlanDetails, IViajeDetalle } from "@/utils/interfaces";

export default async function (detail:IViajeDetalle,id:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const sql = addDetalleViajeSQL(detail,id,user.userId)
            await conn.query(sql)
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al agregar detalle.")
    }
}