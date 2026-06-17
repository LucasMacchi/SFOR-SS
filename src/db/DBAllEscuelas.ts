import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { allEscuelasSQL, allLugaresEntregaSQL, desgloseByLentregaSQL } from "./SQLreturner"
import { IDesglose, ILentrega } from "@/utils/interfaces"



export default async function (): Promise<IDesglose[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const lugares: IDesglose[] = (await conn.query(allEscuelasSQL())).rows
            await conn.end()
            return lugares
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los desgloses")
    }
}