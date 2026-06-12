import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addIntervencionImagenSQL, addIntervencionSQL } from "./SQLreturner"
import seguiminetoEmail from "@/utils/emails/seguiminetoEmail"
import mailerResend from "@/utils/mailerResend"


export default async function (ticket_id:number,comentario:string,user: number,categoria: string,ticket:string,escuela:string,observador: string | null,imagen?:string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            imagen ? await conn.query(addIntervencionImagenSQL(), ["SEGUIMIENTO", ticket_id, user,comentario,imagen]) : await conn.query(addIntervencionSQL(), ["SEGUIMIENTO", ticket_id, user,comentario])
            if(observador) {
                await mailerResend(observador,`TICKET COPA LECHE - ${ticket} - SEGUIMIENTO`,seguiminetoEmail(comentario,ticket,categoria,escuela,ticket_id))
            }
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al hacer seguimiento en el ticket.")
    }
}