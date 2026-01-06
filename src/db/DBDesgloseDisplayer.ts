import { IDesgloseDisplay, IEnvioDetalles, IUniqRemito } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { desglosesDisplayRemitoSQL, detalleEnvioSQL } from "./SQLreturner";

export default async function (remito_id: number): Promise<IDesgloseDisplay[] | null> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res: IDesgloseDisplay[] = (await conn.query(desglosesDisplayRemitoSQL(remito_id))).rows
            for(const envios of res) {
                envios.detalles = (await conn.query(detalleEnvioSQL(envios.envio_id))).rows
            }
            await conn.end()
            return res
        }
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer desgloses del remito en la base de datos")
    }
}