import { IEstados } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { listEstadosRemitosSQL } from "./SQLreturner";

export default async function (): Promise<IEstados[]> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const res: IEstados[] = (await conn.query(listEstadosRemitosSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        return []
    }
}