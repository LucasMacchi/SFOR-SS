import { IDesgloseLlamada } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { editContactoDesgloseSQL } from "./SQLreturner";

export default async function (columna:string,data:string,id:number): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(4)) {
            await conn.connect()
            await conn.query(editContactoDesgloseSQL(columna),[data,id])
            await conn.end()
            return true
        }
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al modificar el contacto del desglose.")
    }
}