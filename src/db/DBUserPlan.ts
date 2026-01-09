import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import { userPlanSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (): Promise<number> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(3) && user) {
            await conn.connect()
            const sql = userPlanSQL()
            const res:number = (await conn.query(sql,[user.userId])).rows[0]['reparto_id']
            await conn.end()
            return res
        }
        await conn.end()
        return 0
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer el plan del usuario en la base de datos")
    }
}