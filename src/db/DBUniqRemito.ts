import { IReporteRemito, IUniqRemito } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { uniqRemitoSQL } from "./SQLreturner";

export default async function (remito_id: string): Promise<IUniqRemito | null> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const res: IUniqRemito = (await conn.query(uniqRemitoSQL(remito_id))).rows[0]
            await conn.end()
            return res
        }
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        return null
    }
}