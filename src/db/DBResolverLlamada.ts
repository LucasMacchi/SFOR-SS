import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { resolverLlamadaSQL } from "./SQLreturner"


export default async function (llamada_id: number,solucion:string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const sql = resolverLlamadaSQL()
            await conn.query(sql,[llamada_id,solucion])
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al resolver llamada en la base de datos")
    }
}