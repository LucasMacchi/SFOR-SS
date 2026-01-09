import { IRemitoUnids } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { changeStateMultipleSQL, despacharSQL, returnRemitoUnidadesSQL, stockAddMovSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import parseRemitoString from "@/utils/parseRemitoString";

export default async function (estado_id:number,remitos:number[]): Promise<void> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            await conn.query(changeStateMultipleSQL(remitos,estado_id))
            if(estado_id === 3) {
                for(const rt of remitos) {
                    const insumosRemito: IRemitoUnids[] = (await conn.query(returnRemitoUnidadesSQL(rt))).rows
                    for(const insumo of insumosRemito) {
                        const des = 'REMITO DESPACHADO - '+parseRemitoString(insumo.pv,insumo.numero)
                        console.log(insumo)
                        await conn.query(stockAddMovSQL(insumo.unidades,false,des,insumo.ins_id))
                    }
                    await conn.query(despacharSQL(rt))      
                }
            }
        }
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar estado en la base de datos")
    }
}