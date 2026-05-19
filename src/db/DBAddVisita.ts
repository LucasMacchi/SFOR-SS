import { IAddVisita, IDesgloseVisitar, IVisitaPreguntaAdd } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { addVisitaDetailSQL, addVisitaSQL, setVisitadoSQL } from "./SQLreturner";

export default async function (v: IAddVisita,preguntas: IVisitaPreguntaAdd[],userId: number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            const visitaId = (await conn.query(addVisitaSQL(), [userId, v.desglose_id, v.fecha_visita])).rows[0].visita_id
            await conn.query(setVisitadoSQL(), [v.desglose_id])
            for await (const p of preguntas) {
                await conn.query(addVisitaDetailSQL(), [p.pregunta, p.respuesta, visitaId])
            }
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer desgloses con su ultima llamada.")
    }
}