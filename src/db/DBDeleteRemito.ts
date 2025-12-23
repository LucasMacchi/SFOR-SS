
import { IEnviosDel } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { deleteEnvioDetSQL, deleteEnvioSQL, deleteRemitoSQL, getEnviosIDSQL } from "./SQLreturner";

export default async function (remito:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(1)) {
            await conn.connect()
            const envios: IEnviosDel[] = (await conn.query(getEnviosIDSQL(remito))).rows
            for(const envio of envios) {
                await conn.query(deleteEnvioDetSQL(envio.envio_id))
                await conn.query(deleteEnvioSQL(envio.envio_id))
            }
            await conn.query(deleteRemitoSQL(remito))
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al eliminar el remito.")
    }
}