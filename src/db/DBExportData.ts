import { IEstados, IRemitoNoExportedRQ } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { getAllNonExportedRtsSQL } from "./SQLreturner";

export default async function (): Promise<IRemitoNoExportedRQ[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const rq: IRemitoNoExportedRQ[] = (await conn.query(getAllNonExportedRtsSQL())).rows
            console.log(rq)
            await conn.end()
            return rq
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los estados de los remitos de la base de datos")
    }
}