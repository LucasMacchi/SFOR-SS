import { IReporte } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { planOcultarSQL, reportesRemitoSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (plan:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const sql = planOcultarSQL()
            await conn.query(sql,[plan])
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al ocultar plan en la base de datos")
    }
}