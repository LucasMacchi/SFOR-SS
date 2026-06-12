
const url = process.env.FRONT_END_URL ?? 'ERROR'

export default function (descripcion: string,ticket:string,categoria: string,escuela:string,id:number): string {

    const html = `
    <html>
        <h2>${categoria}</h2>
        <h2>NUMERO DE TICKET: ${ticket}</h2>
        <h2>ESCUELA: ${escuela}</h2>
        <h3>FECHA DE CAMBIO: ${new Date().toISOString().split("T")[0]}</h3>
        <h3>DESCRIPCION:</h3>
        <p>${descripcion}<p>
        <a href="${url+"ticket/"+id}">Link al TICKET</a>
        <a href="${url+"ticket/"+id}">${url+"ticket/"+id}</a>
    </html>
    `

    return html
}