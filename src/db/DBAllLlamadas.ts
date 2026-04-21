import clientReturner from "./clientReturner";
import { addLlamadaSQL, allLlamadasSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { ILlamada} from "@/utils/interfaces";

export default async function (): Promise<ILlamada[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = allLlamadasSQL()
            const result:ILlamada[] = (await conn.query(sql)).rows
            await conn.end()
            return result
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer llamadas.")
    }
}