import { ESTADOS, ROLES } from "@/utils/enums"
import { IAddDesglose, IAddFactura, IAddPlan, IAddPlanDetails, ICreateInsumo, IRqReportAdd, IViajeDetalle, IViajeRemito } from "@/utils/interfaces"

export function listRemitosSQL(usr: number): string {
    return `SELECT r.remito_id,r.pv,r.numero,r.estado_id,e.des as estado,r.fortificado,r.dias,
            r.fecha_creado,r.fecha_preparado,r.fecha_despachado,
            r.fecha_entregado,r.lentrega_id,l.departamento,l.localidad,f.numero as numF,f.pv as pvF,
            l.completo as cabecera,re.numero as numRep, re.periodo,re.numero as perNumero, (SELECT COUNT(*) FROM public.reporte o WHERE o.remito_id = r.remito_id) as reportes
            FROM public.remito r 
            JOIN estado e ON r.estado_id = e.estado_id 
            JOIN lentrega l ON r.lentrega_id = l.lentrega_id 
            LEFT JOIN factura f on r.remito_id = f.remito_id
            JOIN reparto re on r.reparto_id = re.reparto_id
            WHERE r.reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${usr}) 
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
            r.fortificado,r.dias, l.direccion,
            r.fecha_creado,r.fecha_preparado,r.fecha_despachado,
            r.fecha_entregado,r.lentrega_id,l.departamento,l.localidad,
            f.numero as numF,f.pv as pvF, (SELECT COUNT(*) FROM public.reporte o WHERE o.remito_id = r.remito_id) as reportes,
            l.completo as cabecera, re.numero as numRep, re.periodo
            FROM public.remito r 
            JOIN estado e ON r.estado_id = e.estado_id 
            JOIN lentrega l ON r.lentrega_id = l.lentrega_id 
            LEFT JOIN factura f on r.remito_id = f.remito_id
            JOIN reparto re on r.reparto_id = re.reparto_id
            WHERE r.remito_id = ${id};`
}

export function desglosesDisplayRemitoSQL (remito_id: number) {
    return `SELECT e.envio_id, d.des as dependencia FROM public.envio e JOIN public.desglose d ON e.desglose_id = d.desglose_id WHERE e.remito_id = ${remito_id};`
}

export function changeStateRemitoSQL (id: number,estado: string,remito:number) {
    let fecha = ""
    if(estado === 'PREPARADO') fecha += `fecha_preparado=NOW(),`
    if(estado === 'DESPACHADO') fecha += `fecha_despachado=NOW(),`
    if(estado === 'ENTREGADO') fecha += `fecha_entregado=NOW(),`
    return `UPDATE public.remito SET ${fecha} estado_id=${id} WHERE remito_id = ${remito};`
}

export function detalleEnvioSQL (envio_id : number) {
    return `SELECT d.detail_id,d.envio_id,d.ins_id, i.des as insumo,d.unidades,d.raciones FROM public.envio_details d JOIN public.insumo i ON d.ins_id = i.ins_id WHERE d.envio_id = ${envio_id};`
}

export function reportesRemitoSQL (remito_id:number) {
    return `SELECT r.reporte_id,r.categoria_id,r.des as descripcion, c.des as titulo,r.fecha FROM public.reporte r JOIN reporte_categoria c ON r.categoria_id = c.categoria_id WHERE r.remito_id = ${remito_id};`
}

export function reportesCategoriasSQL () {
    return `SELECT * FROM public.reporte_categoria ORDER BY categoria_id ASC ;`
}

export function createReporteSQL (d: IRqReportAdd,user:number) {
    return `INSERT INTO public.reporte(categoria_id, des, fecha, remito_id, "userId") VALUES (${d.categoria_id}, '${d.descripcion}', NOW(), ${d.remito_id}, ${user});`
}

export function nextRemitoSQL () {
    return `SELECT last_value FROM remito_numero_seq;`
}

export function configTableGETSQL () {
    return `SELECT * FROM public.config order by config_id;`
}

export function repartoAllSQL () {
    return `SELECT * FROM public.reparto ORDER BY reparto_id ASC;`
}

export function facturasSQL () {
    return `SELECT * FROM public.factura order by factura_id desc;`
}

export function facturaGroupSQL () {
    return `SELECT pv,numero,cerrado,sum(raciones) as raciones,fecha_factura FROM public.factura group by pv,numero,cerrado,fecha_factura order by numero desc;`
}

export function remitosNoFacturados (plan:number) {
    return `SELECT r.remito_id,r.pv,r.numero,r.fortificado FROM public.remito r LEFT JOIN public.factura f ON r.remito_id = f.remito_id WHERE r.reparto_id = ${plan} and f.numero is null ORDER BY r.numero;`
}

export function remitoRacionesCobrablesSQL (remito_id : number) {
    return `SELECT sum(d.raciones) FROM public.envio e JOIN public.envio_details d ON e.envio_id = d.envio_id JOIN public.insumo i ON d.ins_id = i.ins_id WHERE e.remito_id = ${remito_id} and i.calculable`
}

export function changeNextRemitoSQL (value:string) {
    //SELECT setval('remito_numero_seq');
    return `SELECT setval('remito_numero_seq', ${value}, true); `
}

export function changeTableConfigSQL (id:number,payload:string) {
    return `UPDATE public.config SET payload=${payload} WHERE config_id = ${id};`
}

export function remitoInFacturaSQL (pv:number,nro:number) {
    return `SELECT r.remito_id,r.pv,r.numero,f.raciones,l.completo FROM public.factura f JOIN public.remito r ON r.remito_id = f.remito_id JOIN public.lentrega l ON r.lentrega_id = l.lentrega_id WHERE f.pv = ${pv} and f.numero = ${nro};`
}

export function pvFacturacionSQL () {
    return `SELECT payload FROM public.config where config_id = 5 order by config_id;`
}

export function addFacturaSQL (d: IAddFactura) {
    return `INSERT INTO public.factura(remito_id, raciones, fecha_factura, fecha_creado, numero, pv, cerrado) VALUES (${d.remito_id},${d.raciones}, '${d.fecha_factura}', NOW(), ${d.numero}, ${d.pv}, false);`
}

export function deleteFacturaSQL (id: number) {
    return `DELETE FROM public.factura where remito_id = ${id};`
}

export function closeFacturaSQL (pv:number,nro:number) {
    return `UPDATE public.factura SET cerrado = true WHERE numero = ${nro} and pv = ${pv};`
}

export function valRacFacturacionSQL () {
    return `SELECT payload FROM public.config where config_id = 6 order by config_id;`
}

export function insumosSQL () {
    return `SELECT * FROM public.insumo ORDER BY ins_id ASC;`
}

export function insumoEditSQL (column: string,ins: number,value:string) {
    return `UPDATE public.insumo SET ${column}=${value} WHERE ins_id = ${ins};`
}

export function insumoAddSQL (d: ICreateInsumo) {
    return `INSERT INTO public.insumo(
    cod1, cod2, cod3, des, caja_palet, gr_racion, gr_unidad, 
    unidades_caja, racunidad, raccaja, calculable)
    VALUES ( ${d.cod1}, ${d.cod2}, ${d.cod3}, '${d.des}', ${d.caja_palet}, ${d.gr_racion}, ${d.gr_total}, ${d.unitades_caja}, ${d.rac_unidad}, ${d.rac_caja}, ${d.calculable});`
}

export function planDetSQL (id:number) {
    return `SELECT * FROM public.plan_detail d JOIN public.insumo i ON i.ins_id = d.ins_id WHERE d.plan_id = ${id} ORDER BY d.detail_id ASC;`
}

export function planAllSQL () {
    return `SELECT * FROM public.plan ORDER BY plan_id ASC;`
}

export function planEditDaysSQL (detail_id: number,days:number) {
    return `UPDATE public.plan_detail SET dias=${days} WHERE detail_id = ${detail_id};`
}

export function planAddDetailSQL (d: IAddPlanDetails) {
    return `INSERT INTO public.plan_detail(ins_id, dias, plan_id) VALUES (${d.ins_id}, ${d.dias}, ${d.plan_id});`
}

export function planAddPlanSQL (d: IAddPlan) {
    return `INSERT INTO public.plan(dias, fortificado, des) VALUES (${d.days}, ${d.fortificado}, '${d.descripcion}') RETURNING plan_id;`
}

export function deleteDetailSQL (id:number) {
    return `DELETE FROM public.plan_detail WHERE detail_id = ${id};`
}

export function allLugaresEntregaSQL () {
    return `SELECT * FROM public.lentrega ORDER BY lentrega_id ASC;`
}

export function desgloseByLentregaSQL (id:number,sent:boolean) {
    return sent ? `SELECT * FROM public.desglose WHERE lentrega_id = ${id} and enviado = false ORDER BY desglose_id ASC;` :`SELECT * FROM public.desglose WHERE lentrega_id = ${id} ORDER BY desglose_id ASC;`
}

export function desgloseByLentregaPlanSQL (id:number) {
    //ESTO HAY QUE VERLE COMO HACER
    return `SELECT * FROM public.desglose WHERE lentrega_id = ${id} ORDER BY desglose_id ASC;`
}

export function departamentosSQl () {
    return `SELECT departamento FROM public.lentrega GROUP BY departamento ORDER BY departamento;`
}

export function desgloseEditSQL (column: string,id: number,value:string | boolean,text:boolean) {
    return text ? `UPDATE public.desglose SET ${column}='${value}' WHERE desglose_id = ${id};` : `UPDATE public.desglose SET ${column}=${value} WHERE desglose_id = ${id};`
}

export function changeStateMultipleSQL (id:number[],estado: number) {
    let arr:string = ""
    let date: string = ""
    id.forEach((id,i) => {
        if(i === 0) arr += id+''
        else arr += ','+id
    });
    if(estado === ESTADOS.DESPACHADO) date = 'fecha_despachado=NOW(),'
    else if (estado === ESTADOS.PREPARADO) date = 'fecha_preparado=NOW(),'
    else if(estado === ESTADOS.ENTREGADO) date = 'fecha_entregado=NOW(),'
    
    return `UPDATE public.remito SET ${date} estado_id=${estado} WHERE remito_id IN (${arr});`
}

export function addDesgloseSQL (data: IAddDesglose) {
    return `INSERT INTO public.desglose(lentrega_id, cue, des, raciones, fortificado, visible, enviado) VALUES (${data.lentrega_id}, ${data.cue}, '${data.des}', ${data.raciones}, ${data.fortificado}, true, false);`
}

export function addViajeSQL (des:string,user:number) {
    return `INSERT INTO public.viaje(des, reparto_id) VALUES ( '${des}', (SELECT reparto_id FROM reparto_user WHERE user_id = ${user})) RETURNING viaje_id;`
}

export function addRemitoViajeSQL (d: IViajeRemito,viajeId: number) {
    return `INSERT INTO public.viaje_remito(plan_id, viaje_id, lentrega_id) VALUES ( ${d.plan_id}, ${viajeId}, ${d.lenterga_id}) RETURNING vremito_id;`
}

export function addDetalleViajeSQL (d: IViajeDetalle,rtId:number,user:number) {
    return `INSERT INTO public.viaje_detalle(desglose_id, vremito_id, raciones,reparto_id) VALUES (${d.desglose_id}, ${rtId}, ${d.raciones},(SELECT reparto_id FROM reparto_user WHERE user_id = ${user}));`
}

export function viajeSQL (userId:number) {
    return `SELECT * FROM public.viaje WHERE reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${userId}) ORDER BY viaje_id DESC `
}

export function viajeRemitoSQL (viaje: number) {
    return `SELECT r.vremito_id,r.plan_id,r.lentrega_id,p.des,l.completo,l.departamento,p.dias FROM public.viaje_remito r JOIN public.plan p ON p.plan_id = r.plan_id JOIN public.lentrega l ON l.lentrega_id = r.lentrega_id WHERE r.viaje_id = ${viaje} ORDER BY r.vremito_id ASC `
}

export function viajeDetalleSQL(vremito:number) {
    return `SELECT d.detalle_id,d.desglose_id,d.vremito_id,d.raciones,dg.des FROM public.viaje_detalle d JOIN public.desglose dg ON d.desglose_id = dg.desglose_id  WHERE d.vremito_id = ${vremito};`
}

export function deleteViajeSQL (id:number,table:string,column: string) {
    return `DELETE FROM public.${table} WHERE ${column}=${id};`
}

