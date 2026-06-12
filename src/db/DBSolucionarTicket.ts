import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addIntervencionImagenSQL, addIntervencionSQL, solucionarTicketSQL } from "./SQLreturner"
import seguiminetoEmail from "@/utils/emails/seguiminetoEmail"
import mailerResend from "@/utils/mailerResend"


export default async function (ticket_id:number,solucion:string,user: number,categoria: string,ticket:string,escuela:string,observador: string | null,imagen?:string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(solucionarTicketSQL(), [ticket_id,solucion])
            imagen ? await conn.query(addIntervencionImagenSQL(), ["SOLUCION", ticket_id, user,solucion,imagen]) : await conn.query(addIntervencionSQL(), ["SOLUCION", ticket_id, user,solucion])
            if(observador) {
                await mailerResend(observador,`TICKET COPA LECHE - ${ticket} - SOLUCIONADO`,seguiminetoEmail(solucion,ticket,categoria,escuela,ticket_id))
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