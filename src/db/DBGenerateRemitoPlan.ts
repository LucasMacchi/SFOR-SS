import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { IAddRemito, } from "@/utils/interfaces";
import { changeStateViajeSQL, createEnvioDetalleSQL, createEnvioSQL, createRemitoSQL, lastTandaSQL, setEnviadoDesgloseSQL, userPlanSQL } from "./SQLreturner";

export default async function (remitos: IAddRemito[]): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            if(remitos[0].viaje_id) await conn.query(changeStateViajeSQL(remitos[0].viaje_id,true))
            const tanda = await (await conn.query(lastTandaSQL())).rows[0]["max"] + 1
            for(const rt of remitos) {
                const remId:number = (await conn.query(createRemitoSQL(rt))).rows[0]["remito_id"]
                for(const envio of rt.envios) {
                    envio.remito_id = remId
                    await conn.query(setEnviadoDesgloseSQL(envio.desglose_id,true))
                    const envioId: number = (await conn.query(createEnvioSQL(envio,tanda))).rows[0]["envio_id"]
                    for(const dt of envio.detalles) {
                        dt.envio_id = envioId
                        await conn.query(createEnvioDetalleSQL(dt))
                    }
                }
            }
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear remitos.")
    }
}

//SEGUIR ACEITANDO