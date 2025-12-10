

import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { deleteFacturaSQL } from "./SQLreturner";

export default async function (data: number[]): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            for(const id of data) {
                const sql = deleteFacturaSQL(id)
                await conn.query(sql)
            }
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar la factura.")
    }
}