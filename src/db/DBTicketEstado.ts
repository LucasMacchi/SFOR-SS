import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addIntervencionSQL, estadoTicketSQL } from "./SQLreturner"
import seguiminetoEmail from "@/utils/emails/seguiminetoEmail"
import mailerResend from "@/utils/mailerResend"


export default async function (ticket_id:number,comentario:string,user: number,categoria: string,ticket:string,escuela:string,observador: string | null,estado:string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(estadoTicketSQL(), [ticket_id,estado])
            await conn.query(addIntervencionSQL(), ["CAMBIO DE ESTADO", ticket_id, user,"CAMBIADO A "+estado+" - "+comentario])
            if(observador) {
                await mailerResend(observador,`TICKET COPA LECHE - ${ticket} - ESTADO CAMBIADO A ${estado}`,seguiminetoEmail(comentario,ticket,categoria,escuela,ticket_id))
            }
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al solucionar el ticket.")
    }
}