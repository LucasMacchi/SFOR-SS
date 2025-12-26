import { IUsuario } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { getAllUsersSQL } from "./SQLreturner";

export default async function (): Promise<IUsuario[] | null> {
    const conn = clientReturner()
    try {
        if(await authJwt(1)) {
            await conn.connect()
            const res: IUsuario[] = (await conn.query((getAllUsersSQL()))).rows
            await conn.end()
            return res
        }
        return null
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los usarios de la base de datos")
    }
}