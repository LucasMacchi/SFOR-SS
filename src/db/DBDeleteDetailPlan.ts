import clientReturner from "./clientReturner";
import { deleteDetailSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (detail_id:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const sql = deleteDetailSQL(detail_id)
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