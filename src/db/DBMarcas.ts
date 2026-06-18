import {IMarca } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import {getMarcasSQL } from "./SQLreturner";

export default async function (): Promise<IMarca[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res:IMarca[] = (await conn.query(getMarcasSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer marcas.")
    }
}