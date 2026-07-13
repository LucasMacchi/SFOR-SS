import { ILote, IRemitosEnvio, IRemitoUnids } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { addStockMov, changeStateMultipleSQL, despacharSQL, getlLotesUpdateStock, lotesUpdateStock, returnRemitoUnidadesSQL, stockAddMovSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import parseRemitoString from "@/utils/parseRemitoString";

export default async function (estado_id:number,remitos:IRemitosEnvio[]): Promise<void> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            await conn.query(changeStateMultipleSQL(remitos.map(r => r.remito_id),estado_id))
            if(estado_id >= 3) {
                for(const rt of remitos) {
                    if(!rt.despachado) {
                        const insumosRemito: IRemitoUnids[] = (await conn.query(returnRemitoUnidadesSQL(rt.remito_id))).rows
                        for(const insumo of insumosRemito) {
                            const lotes: ILote[] = (await conn.query(getlLotesUpdateStock(),[insumo.ins_id])).rows
                            const des = 'REMITO DESPACHADO - '+parseRemitoString(insumo.pv,insumo.numero)
                            let total_restar = insumo.unidades
                            for(const l of lotes) {
                                const dif = l.unidades_actuales - total_restar
                                const prev = l.unidades_actuales
                                const loteDes = " - LOTE "+l.nro + " - "+ l.nombre
                                console.log(l.nombre)
                                if(dif > 0) {
                                    await conn.query(lotesUpdateStock(),[l.lote_id,dif,false])
                                    await conn.query(addStockMov(),[prev,dif,des+loteDes,l.unidades_actuales - dif,insumo.ins_id])
                                    break
                                }
                                else if (dif === 0) {
                                    await conn.query(lotesUpdateStock(),[l.lote_id,dif,true])
                                    await conn.query(addStockMov(),[prev,dif,des+loteDes,l.unidades_actuales,insumo.ins_id])
                                    break
                                }
                                else {
                                    await conn.query(lotesUpdateStock(),[l.lote_id,0,true])
                                    console.log(des+loteDes,)
                                    await conn.query(addStockMov(),[prev,0,des+loteDes,l.unidades_actuales,insumo.ins_id])
                                    total_restar = dif * -1
                                }
                            }
                        }
                        await conn.query(despacharSQL(rt.remito_id))   
                    }
   
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