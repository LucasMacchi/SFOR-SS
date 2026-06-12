
const url = process.env.FRONT_END_URL ?? 'ERROR'

export default function (escuela: string,ticket:string,categoria:string,id:number): string {
    
    const html = `
    <html>
        <h2>${categoria}</h2>
        <h2>NUMERO DE TICKET: ${ticket}</h2>
        <h3>FECHA DE CAMBIO: ${new Date().toISOString().split("T")[0]}</h3>
        <h3>ESCUELA: ${escuela}</h3>
        <a href="${url+"ticket/"+id}">Link al TICKET</a>
        <a href="${url+"ticket/"+id}">${url+"ticket/"+id}</a>
    </html>
    `

    return html
}