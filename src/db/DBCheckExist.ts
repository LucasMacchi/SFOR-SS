import clientReturner from "./clientReturner";

export default async function (pv: number, numero: number): Promise<boolean | number> {
    const conn = clientReturner()
    try {
        await conn.connect()
        const sql = `SELECT remito_id FROM remito where pv = ${pv} and numero = ${numero};`
        const res = (await conn.query(sql)).rows[0]['remito_id']
        if(res) {
            await conn.end()
            return res
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al chequear existencia en la base de datos")
    }
}