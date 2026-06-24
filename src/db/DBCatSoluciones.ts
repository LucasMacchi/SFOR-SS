import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { getSolucionesCatSQL } from "./SQLreturner"
import { ISolucionesCat } from "@/utils/interfaces"


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const res:ISolucionesCat[] = (await conn.query(getSolucionesCatSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer las categorias.")
    }
}