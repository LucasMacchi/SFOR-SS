import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import { insumoAddSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { ICreateInsumo } from "@/utils/interfaces";

export default async function (data: ICreateInsumo): Promise<boolean> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const sql = insumoAddSQL(data)
            await conn.query(sql)
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear insumo en la base de datos")
    }
}