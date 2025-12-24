import clientReturner from "./clientReturner";
import { addRepartoSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (plan:number,year:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(1)) {
            await conn.connect()
            const sql = addRepartoSQL(plan,year)
            await conn.query(sql)
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear reporte en la base de datos")
    }
}