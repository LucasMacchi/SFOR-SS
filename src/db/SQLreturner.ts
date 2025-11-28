
export function listRemitosSQL(usr: number): string {
    return `SELECT r.remito_id,r.pv,r.numero,r.estado_id,e.des as estado,r.fortificado,r.dias,
            r.fecha_creado,r.fecha_preparado,r.fecha_despachado,
            r.fecha_entregado,r.lentrega_id,l.departamento,l.localidad,f.numero as numF,f.pv as pvF,
            l.completo as cabecera,re.numero as numRep, re.periodo, (SELECT COUNT(*) FROM public.reporte o WHERE o.remito_id = r.remito_id) as reportes
            FROM public.remito r 
            JOIN estado e ON r.estado_id = e.estado_id 
            JOIN lentrega l ON r.lentrega_id = l.lentrega_id 
            LEFT JOIN factura f on r.remito_id = f.remito_id
            JOIN reparto re on r.plan = re.reparto_id
            WHERE r.plan = (SELECT reparto_id FROM reparto_user WHERE user_id = ${usr}) 
            ORDER BY r.numero DESC;`
}

export function listEstadosRemitosSQL (): string {
    return `SELECT * FROM public.estado ORDER BY estado_id ASC;`
}
export function updateRepartoUserSQL (usr: number,reparto: number):string {
    return `UPDATE reparto_user SET reparto_id = ${reparto} WHERE user_id = ${usr}`
}
export function userPlanSQL (usr: number):string {
    return `SELECT reparto_id FROM reparto_user WHERE user_id = ${usr}`
}

export function uniqRemitoSQL (id: string) {

    return`SELECT r.remito_id,r.pv,r.numero,r.estado_id,e.des as estado,
            r.fortificado,r.dias,
            r.fecha_creado,r.fecha_preparado,r.fecha_despachado,
            r.fecha_entregado,r.lentrega_id,l.departamento,l.localidad,
            f.numero as numF,f.pv as pvF, (SELECT COUNT(*) FROM public.reporte o WHERE o.remito_id = r.remito_id) as reportes,
            l.completo as cabecera, re.numero as numRep, re.periodo
            FROM public.remito r 
            JOIN estado e ON r.estado_id = e.estado_id 
            JOIN lentrega l ON r.lentrega_id = l.lentrega_id 
            LEFT JOIN factura f on r.remito_id = f.remito_id
            JOIN reparto re on r.plan = re.reparto_id
            WHERE r.remito_id = ${id};`
}

export function desglosesDisplayRemitoSQL (remito_id: number) {
    return `SELECT e.envio_id, d.des as dependencia FROM public.envio e JOIN public.desglose d ON e.desglose_id = d.desglose_id WHERE e.remito_id = ${remito_id};`
}

export function detalleEnvioSQL (envio_id : number) {
    return `SELECT d.detail_id,d.envio_id,d.ins_id, i.des as insumo,d.unidades,d.raciones FROM public.envio_details d JOIN public.insumo i ON d.ins_id = i.ins_id WHERE d.envio_id = ${envio_id};`
}