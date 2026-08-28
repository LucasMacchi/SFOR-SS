import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { allLugaresEntregaSQL, desgloseByLentregaAllSQL, desgloseByLentregaSQL } from "./SQLreturner"
import { ILentrega } from "@/utils/interfaces"



export default async function (all:boolean): Promise<ILentrega[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const lugares: ILentrega[] = (await conn.query(allLugaresEntregaSQL())).rows
            for(const l of lugares) {
                l.desgloses = all ? (await conn.query(desgloseByLentregaAllSQL(l.lentrega_id))).rows : (await conn.query(desgloseByLentregaSQL(l.lentrega_id))).rows
            }
            await conn.end()
            return lugares
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los lugares de entrega")
    }
}