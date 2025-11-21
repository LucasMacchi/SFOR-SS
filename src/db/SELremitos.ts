import clientReturner from "./clientReturner";

export default async function () {
    const conn = clientReturner()
    try {
        const sql = 'SELECT  * FROM glpi_sgp_envio;'
        await conn.connect()
        const data = (await conn.query(sql)).rows
        console.log(data)
        await conn.end()
    } catch (error) {
        await conn.end()
        console.log(error)
    }
}