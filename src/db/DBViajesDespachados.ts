import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { viajesDespachadosSQL } from "./SQLreturner";
import decodeJWT from "@/utils/decodeJWT";
import { IViajesDespachadosRQ } from "@/utils/interfaces";


export default async function () {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const viajes:IViajesDespachadosRQ[] = (await conn.query(viajesDespachadosSQL(user.userId))).rows
            const parsed = viajes.map(v => v.viaje_id)
            await conn.end()
            return parsed
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los datos generales")
    }
}