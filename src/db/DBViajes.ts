import { IViajeRQ } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { viajeDetalleSQL, viajeRemitoSQL, viajeSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import decodeJWT from "@/utils/decodeJWT";

export default async function (): Promise<IViajeRQ[]> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            await conn.connect()
            const viajes:IViajeRQ[] = (await conn.query(viajeSQL(user.userId))).rows
            for(const v of viajes) {
                v.remitos = (await conn.query(viajeRemitoSQL(v.viaje_id))).rows
                for(const r of v.remitos) {
                    r.detalles = (await conn.query(viajeDetalleSQL(r.vremito_id))).rows
                }
            }
            await conn.end()
            return viajes
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los viajes de la base de datos")
    }
}