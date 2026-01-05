import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { editvremitoPlan } from "./SQLreturner"


export default async function (vremito: number,plan: number):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = editvremitoPlan()
            await conn.query(sql,[plan,vremito])
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar remito de vieje en la base de datos")
    }
}