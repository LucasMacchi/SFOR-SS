import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { getIntervencionesTicketSQL } from "./SQLreturner"
import { IintervencionTicket } from "@/utils/interfaces"


export default async function (ticket_id:number) {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const res:IintervencionTicket[] = (await conn.query(getIntervencionesTicketSQL(), [ticket_id])).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer las intervenciones.")
    }
}