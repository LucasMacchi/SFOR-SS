import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { configTableGETSQL, facturasSQL, nextRemitoSQL, repartoAllSQL } from "./SQLreturner";
import { IConfigTable, IFactura, IReparto } from "@/utils/interfaces";


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const nextRem:number = (await conn.query(nextRemitoSQL())).rows[0]['last_value']
            const config:IConfigTable[] = (await conn.query(configTableGETSQL())).rows
            const repartos:IReparto[] = (await conn.query(repartoAllSQL())).rows
            const facturas:IFactura[] = (await conn.query(facturasSQL())).rows
            const data = {
                nextRemitoNro: nextRem ,
                configVariables: config,
                repartos,
                facturas
            }
            await conn.end()
            return data
        }
        await conn.end()
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los datos generales")
    }
}