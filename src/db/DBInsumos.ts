import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { IInsumo } from "@/utils/interfaces";
import { insumosSQL } from "./SQLreturner";

export default async function (): Promise<IInsumo[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const data:IInsumo[] = (await conn.query(insumosSQL())).rows
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
        throw new Error("Error los insumos de la base de datos")
    }
}