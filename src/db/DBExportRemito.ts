import { IRemitoNoExportedRQ } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { exportRemitosSQL } from "./SQLreturner";

export default async function (remitos:IRemitoNoExportedRQ[]): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            await conn.query(exportRemitosSQL(remitos))
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los estados de los remitos de la base de datos")
    }
}