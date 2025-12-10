import clientReturner from "./clientReturner";
import { addDesgloseSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddDesglose } from "@/utils/interfaces";

export default async function (data: IAddDesglose): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = addDesgloseSQL(data)
            await conn.query(sql)
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear desglose en la base de datos")
    }
}