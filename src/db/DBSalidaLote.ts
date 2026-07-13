import clientReturner from "./clientReturner";
import { addLoteSQL, addStockMov, addUnidadesLoteSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (l:number,lname:string ,newUnidades: number,prev:number,i:number,cat:string): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            const addedUnidades = prev - newUnidades
            await conn.connect()
            await conn.query(addUnidadesLoteSQL(),[l,addedUnidades])
            await conn.query(addStockMov(),[prev,addedUnidades,cat+" - UNIDADES DESCONTADAS DEL LOTE - "+lname,newUnidades,i])
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al descontar unidades al lote en la base de datos")
    }
}