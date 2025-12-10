import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { desgloseEditSQL, insumoEditSQL } from "./SQLreturner"


export default async function (id: number,newVal: string | boolean,column:string,text:boolean):Promise<boolean> {
        const conn = clientReturner()
        try {
            if(await authJwt(2)) {
                await conn.connect()
                const sql = desgloseEditSQL(column,id,newVal,text)
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