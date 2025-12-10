import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { changeNextRemitoSQL, changeTableConfigSQL } from "./SQLreturner"


export default async function (id:number,payload: string): Promise<void> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = id !== 99 ? changeTableConfigSQL(id,payload):changeNextRemitoSQL(payload)
            await conn.query(sql)
            await conn.end()
        }
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al cambiar datos generales")
    }
}