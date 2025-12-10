import clientReturner from "./clientReturner";
import { planAddDetailSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddPlanDetails } from "@/utils/interfaces";

export default async function (detail:IAddPlanDetails): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = planAddDetailSQL(detail)
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