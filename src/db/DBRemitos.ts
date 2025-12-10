import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import {IRemitosEnvio } from "@/utils/interfaces";
import { listRemitosSQL } from "@/db/SQLreturner";
import decodeJWT from "@/utils/decodeJWT";

export default async function (): Promise<IRemitosEnvio[]> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            const sql = listRemitosSQL(user.userId)
            await conn.connect()
            const remitos: IRemitosEnvio[] = (await conn.query(sql)).rows
            remitos.forEach(element => {
                element.checked = false
            });
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