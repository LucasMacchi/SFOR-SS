import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { IHistorialDesglose, IInsumo } from "@/utils/interfaces";
import { historialDesgloseSQL } from "./SQLreturner";

export default async function (desglose_id: number): Promise<IHistorialDesglose[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const data:IHistorialDesglose[] = (await conn.query(historialDesgloseSQL(), [desglose_id])).rows
            await conn.end()
            return data
        }
        else {
            await conn.end()
            return []
        }

    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al obtener el historial de desglose de la base de datos")
    }
}