import { IDesgloseLlamada } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { getDesglosesLastCall } from "./SQLreturner";

export default async function (): Promise<IDesgloseLlamada[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const res = (await conn.query(getDesglosesLastCall())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer desgloses con su ultima llamada.")
    }
}