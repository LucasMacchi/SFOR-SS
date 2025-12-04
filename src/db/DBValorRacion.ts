import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { valRacFacturacionSQL } from "./SQLreturner";


export default async function () {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const val:number = (await conn.query(valRacFacturacionSQL())).rows[0]['payload']
            await conn.end()
            return val
        }
        await conn.end()
        return 0
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los datos generales")
    }
}