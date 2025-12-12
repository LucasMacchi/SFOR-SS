import clientReturner from "./clientReturner";
import { deleteViajeSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (id:number,table:string,column: string): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = deleteViajeSQL(id,table,column)
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