import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { getDiferenciaEnviado } from "./SQLreturner"
import {IEnvioDiff} from "@/utils/interfaces"


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res:IEnvioDiff[] = (await conn.query(getDiferenciaEnviado())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer las diferencias en envios.")
    }
}