import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { addTicketAsignadoSQL } from "./SQLreturner"
import { IAddTicket, ITicket } from "@/utils/interfaces"
import mailerResend from "@/utils/mailerResend"
import DBSafeUsuarios from "./DBSafeUsuarios"
import createdEmail from "@/utils/emails/createdEmail"


export default async function (data: IAddTicket,escuela: string): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(addTicketAsignadoSQL(),[data.categoria,data.desglose_id,data.comentarios,data.raciones,data.lentrega_id,data.user_id,
                data.estado,data.numero,data.prioridad,data.user_asignado ? data.user_asignado : null,data.origen,data.user_observador ? data.user_observador : null])
            if(data.user_observador || data.user_asignado) {
                const usuarios = await DBSafeUsuarios()
                const observador = usuarios.find(u => u.userId === data.user_observador)
                const asignado = usuarios.find(u => u.userId === data.user_asignado)
                if(observador) {
                    await mailerResend(observador.email,`NUEVO TICKET DE COPA LECHE - ${data.categoria}`,createdEmail(data,escuela))
                }
                if(asignado) {
                    await mailerResend(asignado.email,`ASIGNADO NUEVO TICKET COPA DE LECHE - ${data.categoria}`,createdEmail(data,escuela))
                }
            }
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer los tickets.")
    }
}