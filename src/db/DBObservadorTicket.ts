import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addIntervencionSQL, observadorTicketSQL } from "./SQLreturner"
import mailerResend from "@/utils/mailerResend"
import observadorEmail from "@/utils/emails/observadorEmail"


export default async function (observador: number,observador_des:string,ticket_id:number,user: number,observador_email:string | null,ticket:string,escuela:string,categoria:string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(observadorTicketSQL(), [ticket_id,observador])
            await conn.query(addIntervencionSQL(), ["TICKET ASIGNADO AL TICKET", ticket_id, user,`OBSERVADOR ASIGNADO A ${observador_des}`])
            if(observador_email) {
                await mailerResend(observador_email,`TICKET COPA LECHE - ${ticket} - OBSERVADOR ASIGNADO`,observadorEmail(escuela,ticket,categoria,ticket_id))
            }
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al asignar ticket.")
    }
}