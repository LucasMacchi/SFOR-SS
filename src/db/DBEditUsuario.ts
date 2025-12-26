import authJwt from "@/utils/authJwt"
import clientReturner from "./clientReturner"
import { userEditSQL } from "./SQLreturner"


export default async function (user_id: number,newVal: string,column:string):Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            const sql = userEditSQL(column,user_id,newVal)
            await conn.query(sql)
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar usuario en la base de datos")
    }
}