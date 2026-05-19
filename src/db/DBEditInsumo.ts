import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { insumoEditSQL } from "./SQLreturner"


export default async function (ins_id: number,newVal: string | boolean,column:string):Promise<boolean> {
        const conn = clientReturner()
        try {
            if(await authJwt(2)) {
                await conn.connect()
                const sql = insumoEditSQL(column,ins_id,newVal)
                await conn.query(sql)
                return true
            }
            await conn.end()
            return false
        } catch (error) {
            await conn.end()
            console.log(error)
            throw new Error("Error al modificar insumo en la base de datos")
        }
}