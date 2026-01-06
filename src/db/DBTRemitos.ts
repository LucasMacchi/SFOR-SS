import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import {IRemitoT } from "@/utils/interfaces";
import {traerDetallesEnviosRemitoSQL, traerEnviosRemitoSQL, traerRemitosViajeSQL, traerRemitosRangoSQL } from "@/db/SQLreturner";
import decodeJWT from "@/utils/decodeJWT";

export default async function (viaje:number,start:number,end:number): Promise<IRemitoT[]> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            await conn.connect()
            let remitos: IRemitoT[] = []
            if(viaje) {
                remitos = (await conn.query(traerRemitosViajeSQL(user.userId,viaje))).rows
            }
            else if(start && end && !viaje) {
                remitos = (await conn.query(traerRemitosRangoSQL(user.userId,start,end))).rows
            }
            for(const rt of remitos) {
                rt.envios = (await conn.query(traerEnviosRemitoSQL(rt.remito_id))).rows
                for(const envio of rt.envios) {
                    envio.detalles = (await conn.query(traerDetallesEnviosRemitoSQL(envio.envio_id))).rows
                }
            }
            await conn.end()
            return remitos
        }
        else {
            await conn.end()
            return []
        }
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los remitos de la base de datos")
    }
}