import { IViajeExcelRQ, IViajeRQ } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { dataExcelViajesSQL, viajeDetalleSQL, viajeRemitoSQL, viajeSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import decodeJWT from "@/utils/decodeJWT";

export default async function (): Promise<IViajeExcelRQ[]> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const viajes:IViajeExcelRQ[] = (await conn.query(dataExcelViajesSQL(user.userId))).rows
            await conn.end()
            return viajes
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los viajes de la base de datos")
    }
}