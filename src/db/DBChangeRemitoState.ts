import { IRemitoUnids } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { changeStateRemitoSQL, despacharSQL, returnRemitoUnidadesSQL, stockAddMovSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import parseRemitoString from "@/utils/parseRemitoString";

export default async function (estado_id:number,estado:string,remito:number): Promise<void> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            await conn.query(changeStateRemitoSQL(estado),[estado_id,remito])
            if(estado_id === 3) {
                const insumosRemito: IRemitoUnids[] = (await conn.query(returnRemitoUnidadesSQL(remito))).rows
                for(const insumo of insumosRemito) {
                    const des = 'REMITO DESPACHADO - '+parseRemitoString(insumo.pv,insumo.numero)
                    await conn.query(stockAddMovSQL(insumo.unidades,false,des,insumo.ins_id))
                }
                await conn.query(despacharSQL(remito))
            }
            await conn.end()
        }
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar estado en la base de datos")
    }
}