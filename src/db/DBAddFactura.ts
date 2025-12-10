import clientReturner from "./clientReturner";
import { addFacturaSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddFactura, } from "@/utils/interfaces";

export default async function (data: IAddFactura[]): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt(2)) {
            await conn.connect()
            for(const remito of data) {
                const sql = addFacturaSQL(remito)
                await conn.query(sql)
            }
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear una factura.")
    }
}