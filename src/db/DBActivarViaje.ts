
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { changeStateViajeSQL } from "./SQLreturner";

export default async function (viaje: number,state:boolean): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = changeStateViajeSQL(viaje,state)
            await conn.query(sql)
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar el viaje.")
    }
}