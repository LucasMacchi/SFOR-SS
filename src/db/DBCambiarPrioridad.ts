import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addIntervencionSQL, cambiarPrioridadTicketSQL } from "./SQLreturner"
import changePrioridadEmail from "@/utils/emails/changePrioridadEmail"
import mailerResend from "@/utils/mailerResend"


export default async function (ticket_id:number,prioridad:number,prev:string,post:string,user: number,ticket:string,observador:string | null):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(cambiarPrioridadTicketSQL(), [ticket_id,prioridad])
            await conn.query(addIntervencionSQL(), ["CAMBIO DE PRIORIDAD", ticket_id, user,`PRIORIDAD CAMBIADA DE ${prev} A ${post}`])
            if(observador) {
                await mailerResend(observador,`TICKET COPA LECHE - ${ticket} - CAMBIO PRIORIDAD`,changePrioridadEmail(prev,post,ticket,ticket_id))
            }
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al cambiar la prioridad del ticket.")
    }
}