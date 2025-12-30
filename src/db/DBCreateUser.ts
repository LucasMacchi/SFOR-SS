import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { IUsuario } from "@/utils/interfaces";
import { createPlanNewUserSQL, createUserSQL } from "./SQLreturner";

export default async function (u:IUsuario): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(1)) {
            await conn.connect()
            const id = (await conn.query(createUserSQL(u))).rows[0]["userId"]
            await conn.query(createPlanNewUserSQL(), [id])
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al agregar usuario.")
    }
}