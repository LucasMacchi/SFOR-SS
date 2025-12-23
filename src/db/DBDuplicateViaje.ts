

import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { IViajeRQ } from "@/utils/interfaces";
import { addViajeSQL, viajeDetalleDupSQL, viajeDupSQL, viajeRemitoDupSQL } from "./SQLreturner";

export default async function (viaje: IViajeRQ,reparto_id:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const viajeId: number = (await conn.query(viajeDupSQL(reparto_id,viaje.des))).rows[0]["viaje_id"]
            for(const r of viaje.remitos) {
                const remitoId: number = (await conn.query(viajeRemitoDupSQL(r.plan_id,viajeId,r.lentrega_id))).rows[0]["vremito_id"]
                for(const d of r.detalles) {
                    await conn.query(viajeDetalleDupSQL(d.desglose_id,remitoId,d.raciones,reparto_id))
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
        throw new Error("Error al duplicar viaje en la base de datos")
    }
}