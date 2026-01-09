import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import { updateRepartoUserSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (repId: number): Promise<void> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            await conn.connect()
            const sql = updateRepartoUserSQL()
            await conn.query(sql,[repId,user.userId])
        }
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al cambiar el plan del usuario")
    }
}