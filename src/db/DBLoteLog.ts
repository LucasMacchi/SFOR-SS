import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { ILoteLog } from "@/utils/interfaces";
import { loteLogSQL } from "./SQLreturner";

export default async function (ins_id: number): Promise<ILoteLog[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const data:ILoteLog[] = (await conn.query(loteLogSQL(ins_id))).rows
            await conn.end()
            return data
        }
        else {
            await conn.end()
            return []
        }

    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error los logs de la base de datos")
    }
}

