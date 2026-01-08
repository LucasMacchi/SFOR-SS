import { IRemitoNoExportedRQ } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import {getExportarDataRango } from "./SQLreturner";

export default async function (start:number,end:number,pv:number): Promise<IRemitoNoExportedRQ[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const rq: IRemitoNoExportedRQ[] = (await conn.query(getExportarDataRango(),[pv,start,end])).rows
            console.log(rq)
            await conn.end()
            return rq
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los estados de los remitos de la base de datos")
    }
}