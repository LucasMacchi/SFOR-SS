import { IPlan } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { planAllSQL, planDetSQL } from "./SQLreturner";

export default async function (): Promise<IPlan[] | null> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res: IPlan[] = (await conn.query(planAllSQL())).rows
            for(const p of res) {
                p.detalles = (await conn.query(planDetSQL(p.plan_id))).rows
            }
            await conn.end()
            return res
        }
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer planes en la base de datos")
    }
}