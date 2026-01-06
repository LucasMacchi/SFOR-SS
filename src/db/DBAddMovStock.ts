import clientReturner from "./clientReturner";
import { stockAddMovSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IStockAdd } from "@/utils/interfaces";

export default async function (data: IStockAdd): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            data.des = data.title + " - "+data.des
            const sql = stockAddMovSQL(data.value,data.sum,data.des,data.ins_id)
            await conn.query(sql)
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar stock en la base de datos")
    }
}