import decodeJWT from "@/utils/decodeJWT";
import clientReturner from "./clientReturner";
import { updateRepartoUserSQL, userPlanSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (): Promise<number> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt() && user) {
            await conn.connect()
            const sql = userPlanSQL(user.userId)
            const res:number = (await conn.query(sql)).rows[0]['reparto_id']
            await conn.end()
            return res
        }
        await conn.end()
        return 0
    } catch (error) {
        await conn.end()
        console.log(error)
        return 0
    }
}