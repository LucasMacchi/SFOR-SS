import { IReporte } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import { reportesRemitoSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";

export default async function (remito:number): Promise<IReporte[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const sql = reportesRemitoSQL()
            const reportes:IReporte[] = (await conn.query(sql,[remito])).rows
            await conn.end()
            return reportes
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los reportes del remito en la base de datos")
    }
}