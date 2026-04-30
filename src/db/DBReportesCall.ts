import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { getAllReportesCallSQL, getDesglosesLastCall } from "./SQLreturner"


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res = (await conn.query(getAllReportesCallSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error traer reportes de llamadas llamada.")
    }
}