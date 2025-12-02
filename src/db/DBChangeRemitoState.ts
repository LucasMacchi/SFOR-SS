import clientReturner from "./clientReturner";
import { changeStateRemitoSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (estado_id:number,estado:string,remito:number): Promise<void> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const sql = changeStateRemitoSQL(estado_id,estado,remito)
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