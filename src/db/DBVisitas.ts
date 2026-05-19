import { IVisita } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import {getVisitaPreguntasSQL, getVisitasSQL } from "./SQLreturner";

export default async function (): Promise<IVisita[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const res:IVisita[] = (await conn.query(getVisitasSQL())).rows
            for (const visita of res) {
                visita.preguntas = (await conn.query(getVisitaPreguntasSQL(), [visita.visita_id])).rows
            }
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer visitas.")
    }
}