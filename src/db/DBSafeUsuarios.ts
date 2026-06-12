import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import {getUsuariosSafeSQL } from "./SQLreturner"
import { IUsuariosSafe } from "@/utils/interfaces"

export default async function ():Promise<IUsuariosSafe[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const result: IUsuariosSafe[] = (await conn.query(getUsuariosSafeSQL())).rows
            await conn.end()
            return result
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer usuarios.")
    }
}