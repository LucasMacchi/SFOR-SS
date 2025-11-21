

import authJwt from "@/utils/authJwt";
import clientReturner from "./clientReturner";
import { IRemitoFacturacionResponse, IRemitosEnvio } from "@/utils/interfaces";

export default async function (): Promise<IRemitosEnvio[]> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            const sql = `SELECT e.nro_remito, e.ultima_mod, e.estado,l.departamento,l.localidad,l.completo,e.dias,e.fortificado,e.fecha_created as fecha,(SELECT count(*) FROM public.glpi_sgp_remito_reporte where remito = e.nro_remito) as reportes, (SELECT factura FROM glpi_sgp_remito_facturacion where remito = e.nro_remito),(SELECT fecha FROM glpi_sgp_remito_log where remito = e.nro_remito and estado = 'ENTREGADO') as fecha_entrega FROM public.glpi_sgp_envio e  JOIN public.glpi_sgp_lentrega l ON l.lentrega_id = e.lentrega_id  GROUP BY e.fortificado,e.nro_remito,e.estado,e.lentrega_id,l.departamento,l.localidad,l.completo,e.ultima_mod,e.dias,e.fecha_created ORDER BY nro_remito DESC LIMIT 1500;`
            await conn.connect()
            const remitos: IRemitosEnvio[] = (await conn.query(sql)).rows
            for(const rt of remitos) {
                const sql2 = `select des, SUM(raciones) from glpi_sgp_envio_details where nro_remito = '${rt.nro_remito}' and des like '%9000%'  or nro_remito = '${rt.nro_remito}' and des like '%9001%'  or nro_remito = '${rt.nro_remito}' and des like '%9021%'  or nro_remito = '${rt.nro_remito}' and des like '%9013%' or nro_remito = '${rt.nro_remito}' and des like '%9016%' group by des;`
                const raciones: IRemitoFacturacionResponse[] = (await conn.query(sql2)).rows
                let racTotal = 0
                for(const item of raciones) {
                    racTotal += parseInt(item.sum)
                }
                rt.raciones = racTotal
            }
            await conn.end()
            return remitos
        }
        else {
            await conn.end()
            return []
        }

    } catch (error) {
        await conn.end()
        console.log(error)
        return []
    }
}