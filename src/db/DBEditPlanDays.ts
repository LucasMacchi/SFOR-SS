import { IPlan } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { planAllSQL, planDetSQL, planEditDaysSQL } from "./SQLreturner";

export default async function (detail_id:number,days:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            await conn.query(planEditDaysSQL(detail_id,days))
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer planes en la base de datos")
    }
}