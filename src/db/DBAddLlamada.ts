import clientReturner from "./clientReturner";
import { addLlamadaSQL, addPreguntaSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddLlamada, IAddPregunta } from "@/utils/interfaces";

export default async function (l: IAddLlamada,preguntas:IAddPregunta[]): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = addLlamadaSQL()
            const sql2 = addPreguntaSQL()
            const result = (await conn.query(sql, [l.fecha, l.desglose_id, l.tiempo, l.prioridad, l.prioridad])).rows[0]['llamada_id']
            if(result && preguntas.length > 0) {
                for await (const p of preguntas) {
                    p.llamada_id = result
                    if(p.respuesta.length === 0) p.respuesta = "SIN RESPUESTA"
                    await conn.query(sql2, [p.fecha, p.pregunta, p.respuesta, p.llamada_id])
                }
            }
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al agregar llamada.")
    }
}