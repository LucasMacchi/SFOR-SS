import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { pvFacturacionSQL } from "./SQLreturner";


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const pv:number = (await conn.query(pvFacturacionSQL())).rows[0]['payload']
            await conn.end()
            return pv
        }
        await conn.end()
        return 0
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los datos generales")
    }
}