import { IEstados } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { listEstadosRemitosSQL } from "./SQLreturner";

export default async function (): Promise<IEstados[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res: IEstados[] = (await conn.query(listEstadosRemitosSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los estados de los remitos de la base de datos")
    }
}