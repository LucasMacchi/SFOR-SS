import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { departamentosSQl } from "./SQLreturner"
import { IDepartamento } from "@/utils/interfaces"


export default async function (): Promise<string[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const departamentos: IDepartamento[] = (await conn.query(departamentosSQl())).rows
            let arr = departamentos.map(d => d.departamento)
            await conn.end()
            return arr
        }
        await conn.end()
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer los lugares de entrega")
    }
}