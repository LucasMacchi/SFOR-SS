
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { deleteViajeAllSQL } from "./SQLreturner";

export default async function (viaje:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(1)) {
            await conn.connect()
            await conn.query(deleteViajeAllSQL(),[viaje])
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al viaje el remito.")
    }
}