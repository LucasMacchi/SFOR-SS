import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { facturaGroupSQL, remitoRacionesCobrablesSQL, remitosNoFacturados } from "./SQLreturner"
import { IFacturaAgrupado, IRemitosNoF } from "@/utils/interfaces"
import decodeJWT from "@/utils/decodeJWT"



export default async function (plan:number): Promise<IRemitosNoF[] | null> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const remitosNoF: IRemitosNoF[] = (await conn.query(remitosNoFacturados(plan))).rows
            for(const rt of remitosNoF) {
                rt.raciones = await (await conn.query(remitoRacionesCobrablesSQL(rt.remito_id))).rows[0]["sum"]
            }
            await conn.end()
            return remitosNoF
        }
        await conn.end()
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer las facturas")
    }
}