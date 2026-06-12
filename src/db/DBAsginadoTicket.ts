import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addIntervencionSQL, asignandoTicketSQL } from "./SQLreturner"
import mailerResend from "@/utils/mailerResend"
import asignadoEmail from "@/utils/emails/asignadoEmail"


export default async function (asignado: number,asignado_des:string,ticket_id:number,user: number,asignado_Email: string | null,escuela:string,ticket: string,categoria: string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(asignandoTicketSQL(), [ticket_id,asignado])
            await conn.query(addIntervencionSQL(), ["TICKET ASIGNADO", ticket_id, user,`TICKET ASIGNADO A ${asignado_des}`])
            if(asignado_Email) {
                await mailerResend(asignado_Email,`ASIGNADO NUEVO TICKET COPA DE LECHE - ${ticket}`,asignadoEmail(escuela,ticket,categoria,ticket_id))
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