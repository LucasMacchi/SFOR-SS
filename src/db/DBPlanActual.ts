import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { IReparto } from "@/utils/interfaces";

export default async function (): Promise<IReparto[]> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            const sql = 'SELECT  * FROM public.reparto ORDER BY reparto_id DESC'
            await conn.connect()
            const data:IReparto[] = (await conn.query(sql)).rows
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
        return []
    }
}