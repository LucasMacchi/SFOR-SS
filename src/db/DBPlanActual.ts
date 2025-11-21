import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";

export default async function (): Promise<number> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            const sql = 'SELECT  * FROM glpi_sgp_config where config_id = 8;'
            await conn.connect()
            const data:number = (await conn.query(sql)).rows[0]["payload"]
            await conn.end()
            return data
        }
        else {
            await conn.end()
            return 0
        }

    } catch (error) {
        await conn.end()
        console.log(error)
        return 0
    }
}