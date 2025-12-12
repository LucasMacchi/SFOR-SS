import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addDetalleViajeSQL, addRemitoViajeSQL, addViajeSQL } from "./SQLreturner"
import { IViaje } from "@/utils/interfaces"
import decodeJWT from "@/utils/decodeJWT"



export default async function (viaje:IViaje): Promise<boolean> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const viajeId: number = (await conn.query(addViajeSQL(viaje.des,user.userId))).rows[0]["viaje_id"]
            for(const r of viaje.remitos) {
                const remitoId: number = (await conn.query(addRemitoViajeSQL(r,viajeId))).rows[0]["vremito_id"]
                for(const d of r.detalles) {
                    await conn.query(addDetalleViajeSQL(d,remitoId,user.userId))
                }
            }
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear los viajes")
    }
}