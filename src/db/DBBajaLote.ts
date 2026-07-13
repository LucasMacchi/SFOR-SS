import clientReturner from "./clientReturner";
import { addLoteSQL, addStockMov, bajaLoteSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (lote:number,lname:string,state:boolean,i:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            await conn.query(bajaLoteSQL(),[lote,state])
            await conn.query(addStockMov(),[0,0,"LOTE - "+lname+" - DADO DE "+(state ? "BAJA" : "ALTA"),0,i])
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al cambiar el estado del lote en la base de datos")
    }
}