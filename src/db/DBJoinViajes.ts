import authJwt from "@/utils/authJwt";
import clientReturner from "@/db/clientReturner";
import { viajeDelSQL, viajeJoinSQL } from "@/db/SQLreturner";

export default async function ( viaje: number, viajeU:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            await conn.query(viajeJoinSQL(),[viajeU,viaje])
            await conn.query(viajeDelSQL(),[viaje])
            await conn.end()
            return true
        }
        conn.end()
        return false

    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error los insumos de la base de datos")
    }
}