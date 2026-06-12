import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { getTicketsSQL } from "./SQLreturner"
import { ITicket } from "@/utils/interfaces"


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const res:ITicket[] = (await conn.query(getTicketsSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer los tickets.")
    }
}