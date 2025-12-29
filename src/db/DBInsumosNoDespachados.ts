import { IReporteCategoria } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { remitosNoDespachadoInsSQL } from "./SQLreturner";
import decodeJWT from "@/utils/decodeJWT";

interface IInsumoNoDesp {
    ins_id: number,
    sum: number
}

export default async function (): Promise<IInsumoNoDesp[]> {
    const conn = clientReturner()
    try {
        const user = await decodeJWT()
        if(await authJwt(2) && user) {
            await conn.connect()
            const res: IInsumoNoDesp[] = (await conn.query(remitosNoDespachadoInsSQL(user.userId))).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer las categorias de reportes")
    }
}