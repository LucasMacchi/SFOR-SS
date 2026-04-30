import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { getAllLlamadasSQL } from "./SQLreturner"
import { IInformeLlamada } from "@/utils/interfaces"


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const res:IInformeLlamada[] = (await conn.query(getAllLlamadasSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer las llamadas.")
    }
}