import clientReturner from "./clientReturner";
import { addLlamadaNoAtendidaSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddLlamada } from "@/utils/interfaces";

export default async function (l: IAddLlamada): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const sql = addLlamadaNoAtendidaSQL()
            await conn.query(sql, [l.fecha, l.desglose_id, l.tiempo, l.prioridad, l.prioridad, 1])
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al agregar llamada.")
    }
}