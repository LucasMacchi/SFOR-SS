import clientReturner from "./clientReturner";
import { addLoteSQL, addStockMov } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddLote } from "@/utils/interfaces";

export default async function (l: IAddLote): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            await conn.query(addLoteSQL(),[l.nro,l.fecha_venc,l.factura,l.rne,l.rnpa,l.marca_id,l.unidades,l.unidades,l.ins_id,l.monto_factura])
            await conn.query(addStockMov(),[l.unidades,l.unidades,"LOTE AGREGADO - "+l.nro,l.unidades,l.ins_id])
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al agregar lote en la base de datos")
    }
}