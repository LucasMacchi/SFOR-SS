import clientReturner from "./clientReturner";
import { changeStateMultipleSQL, changeStateRemitoSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (estado_id:number,remitos:number[]): Promise<void> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const sql = changeStateMultipleSQL(remitos,estado_id)
            console.log(sql)
            await conn.query(sql)
        }
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar estado en la base de datos")
    }
}