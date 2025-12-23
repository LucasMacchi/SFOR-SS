import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import {IEnviosExcelRQ, IRemitosEnvio } from "@/utils/interfaces";
import { enviosExcelSQL, listRemitosSQL } from "@/db/SQLreturner";
import decodeJWT from "@/utils/decodeJWT";

export default async function (): Promise<IEnviosExcelRQ[]> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            const sql = enviosExcelSQL(user.userId)
            await conn.connect()
            const remitos: IEnviosExcelRQ[] = (await conn.query(sql)).rows
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
        throw new Error("Error al traer los envios de la base de datos")
    }
}