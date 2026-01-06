import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { IStockLog } from "@/utils/interfaces";
import { stockLogsSQL } from "./SQLreturner";

export default async function (): Promise<IStockLog[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const data:IStockLog[] = (await conn.query(stockLogsSQL())).rows
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

