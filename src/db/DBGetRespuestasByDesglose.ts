import clientReturner from "./clientReturner";
import { getRespuestasDesgloseSQL, llamadasByDesgloseSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { ILlamada, IPregunta} from "@/utils/interfaces";

export default async function (desglose_id: number): Promise<IPregunta[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = getRespuestasDesgloseSQL()
            const result:IPregunta[] = (await conn.query(sql,[desglose_id])).rows
            await conn.end()
            return result
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer respuestas del desglose.")
    }
}