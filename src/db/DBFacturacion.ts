import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { facturaGroupSQL, remitoInFacturaSQL, remitoRacionesCobrablesSQL, remitosNoFacturados } from "./SQLreturner"
import { IFacturaAgrupado, IRemitosNoF } from "@/utils/interfaces"



export default async function (): Promise<IFacturaAgrupado[] | null> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const facturas: IFacturaAgrupado[] = (await conn.query(facturaGroupSQL())).rows
            for(const f of facturas) {
                f.remitos = (await conn.query(remitoInFacturaSQL(f.pv,f.numero))).rows
            }
            await conn.end()
            return facturas
        }
        await conn.end()
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer las facturas")
    }
}