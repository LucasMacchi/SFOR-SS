import { IReporteCategoria } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import authJwt from "@/utils/authJwt";
import { reportesCategoriasSQL } from "./SQLreturner";

export default async function (): Promise<IReporteCategoria[]> {
    const conn = clientReturner()
    try {
        if(await authJwt(3)) {
            await conn.connect()
            const res: IReporteCategoria[] = (await conn.query(reportesCategoriasSQL())).rows
            await conn.end()
            return res
        }
        return []
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al traer las categorias de reportes")
    }
}