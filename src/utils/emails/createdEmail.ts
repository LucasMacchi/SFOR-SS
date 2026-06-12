import { IAddTicket } from "../interfaces"

const url = process.env.FRONT_END_URL ?? 'ERROR'

export default function (ticket: IAddTicket, escuela: string): string {

    const html = `
    <html>
        <h2>NUMERO DE TICKET: ${ticket.numero}</h2>
        <h2>PRIORIDAD: ${ticket.prioridad === 1 ? "ALTA" : ticket.prioridad === 2 ? "MEDIA" : "BAJA"}</h2>
        <h3>FECHA DE CREACION: ${new Date().toISOString().split("T")[0]}</h3>
        <h3>ESCUELA: ${escuela}</h3>
        <h3>ORIGEN: ${ticket.origen}</h3>
        <h3>DESCRIPCION: </h3>
        <p>${ticket.comentarios}</p>
    </html>
    `

    return html
}