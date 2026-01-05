import { ESTADOS } from "@/utils/enums"
import { IAddDesglose, IAddEnvio, IAddFactura, IAddPlan, IAddPlanDetails, IAddRemito, ICreateInsumo, IEnvioDetalles, IRemitoNoExportedRQ, IRqReportAdd, IUsuario, IViajeDetalle, IViajeRemito } from "@/utils/interfaces"

export function listRemitosSQL(usr: number): string {
    return `SELECT r.remito_id,r.pv,r.numero,r.estado_id,e.des as estado,r.fortificado,r.dias,
            r.fecha_creado,r.fecha_preparado,r.fecha_despachado, r.viaje_id,
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
    return `SELECT r.remito_id,r.pv,r.numero,f.raciones,l.completo,r.fortificado,l.departamento,l.localidad FROM public.factura f JOIN public.remito r ON r.remito_id = f.remito_id JOIN public.lentrega l ON r.lentrega_id = l.lentrega_id WHERE f.pv = ${pv} and f.numero = ${nro};`
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
    cod1, ${d.cod2 ? "cod2," : ''} ${d.cod3 ? "cod3," : ''} des, caja_palet, gr_racion, gr_unidad, 
    unidades_caja, racunidad, raccaja, calculable)
    VALUES ( ${d.cod1}, ${d.cod2 ? d.cod2+"," : ''} ${d.cod3 ? d.cod3+"," : ''} '${d.des}', ${d.caja_palet}, ${d.gr_racion}, ${d.gr_total}, ${d.unitades_caja}, ${d.rac_unidad}, ${d.rac_caja}, ${d.calculable});`
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

export function desgloseByLentregaSQL (id:number,sent:boolean,hidden:boolean) {
    return sent ? `SELECT * FROM public.desglose WHERE lentrega_id = ${id} and enviado = false ${hidden ? "":"and visible = true"} ORDER BY desglose_id ASC;` :`SELECT * FROM public.desglose WHERE lentrega_id = ${id} ${hidden ? "":" and visible = true"} ORDER BY desglose_id ASC;`
}

export function desgloseByLentregaPlanSQL (id:number) {
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

export function despacharMultipleSQL (id:number[]) {
    let arr:string = ""
    id.forEach((id,i) => {
        if(i === 0) arr += id+''
        else arr += ','+id
    });
    
    return `UPDATE public.remito SET despachado=true WHERE remito_id IN (${arr}) AND despachado=false;`
}

export function addDesgloseSQL (data: IAddDesglose) {
    return `INSERT INTO public.desglose(lentrega_id, cue, des, raciones, fortificado, visible, enviado) VALUES (${data.lentrega_id}, ${data.cue}, '${data.des}', ${data.raciones}, ${data.fortificado}, true, false);`
}

export function addViajeSQL (des:string,user:number) {
    return `INSERT INTO public.viaje(des, reparto_id,procesado) VALUES ( '${des}', (SELECT reparto_id FROM reparto_user WHERE user_id = ${user}),false) RETURNING viaje_id;`
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

export function createRemitoSQL (rt: IAddRemito) {
    return `INSERT INTO public.remito(pv, estado_id, lentrega_id, fortificado, reparto_id, dias, fecha_creado, viaje_id) 
    VALUES ((SELECT CAST(payload AS integer) FROM public.config WHERE config_id = 4), 
    ${rt.estado_id}, ${rt.lentrega_id}, ${rt.fortificado}, 
    ${rt.reparto_id}, ${rt.dias}, ${rt.fecha_creado}, ${rt.viaje_id}) RETURNING remito_id;`
}

export function createEnvioSQL (e: IAddEnvio,tanda:number) {
    return `INSERT INTO public.envio(remito_id, desglose_id, tanda, fecha, remito, fortificado) VALUES ( ${e.remito_id}, ${e.desglose_id}, ${tanda}, NOW(), null, ${e.fortificado}) RETURNING envio_id;`
}

export function createEnvioDetalleSQL (d: IEnvioDetalles) {
    return `INSERT INTO public.envio_details(envio_id, ins_id, raciones, unidades) VALUES (${d.envio_id}, ${d.ins_id}, ${d.raciones}, ${d.unidades});`
}

export function lastTandaSQL () {
    return `SELECT MAX(tanda) FROM public.envio;`
}
 
export function changeStateViajeSQL (id:number,state:boolean) {
    return `UPDATE public.viaje SET procesado=${state} WHERE viaje_Id = ${id};`
}

export function traerRemitosViajeSQL (user:number,viaje:number) {
    return`SELECT * FROM public.remito r JOIN public.lentrega l ON r.lentrega_id = l.lentrega_id WHERE reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${user}) and viaje_id = ${viaje} ORDER BY numero DESC;`
}

export function traerRemitosRangoSQL (user:number,start:number,end:number) {
    return`SELECT * FROM public.remito r JOIN public.lentrega l ON r.lentrega_id = l.lentrega_id 
            WHERE reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${user}) 
            AND numero BETWEEN ${start} and ${end} ORDER BY numero DESC;`
}

export function traerEnviosRemitoSQL (id:number) {
    return `SELECT * FROM public.envio e JOIN public.desglose d ON e.desglose_id = d.desglose_id WHERE remito_id = ${id} ORDER BY remito_id DESC;`
}

export function traerDetallesEnviosRemitoSQL (id:number) {
    return `SELECT * FROM public.envio_details d JOIN public.insumo i ON d.ins_id = i.ins_id WHERE d.envio_id = ${id} ORDER BY d.ins_id ASC `
}

export function setEnviadoDesgloseSQL (id:number,state:boolean) {
    return `UPDATE public.desglose SET enviado=${state} WHERE desglose_id=${id};`
}

export function stockLogsSQL () {
    return `SELECT log_id,l.ins_id,unidades_prev,unidades_new,fecha,descripcion,des as insumo,cod1,cod2,cod3 FROM public.stock_log l JOIN public.insumo i ON i.ins_id = l.ins_id ORDER BY l.log_id DESC;`
}

export function stockAddMovSQL (value: number,sum:boolean,des: string,ins_id:number) {
    return `SELECT updateStockFn(${ins_id},${value},'${des}',${sum});`
}

export function despacharSQL (remito:number) {
    return `UPDATE public.remito SET despachado=true WHERE remito_id = ${remito} AND despachado = false;`
}

export function returnRemitoUnidadesSQL (remito:number) {
    return `SELECT r.pv,r.numero,d.ins_id,SUM(d.unidades) as unidades FROM public.remito r 
    JOIN public.envio e ON r.remito_id = e.remito_id 
    JOIN public.envio_details d ON e.envio_id = d.envio_id 
    WHERE r.remito_id = ${remito} AND r.despachado = false GROUP BY d.ins_id,r.pv,r.numero;`
}

export function viajeDupSQL (reparto_id: number,des: string) {
    return `INSERT INTO public.viaje(des, reparto_id,procesado) VALUES ( '${des}', ${reparto_id} ,false) RETURNING viaje_id;`
}

export function viajeRemitoDupSQL (plan_id: number,viaje_id:number,lentrega:number) {
    return `INSERT INTO public.viaje_remito(plan_id, viaje_id, lentrega_id) VALUES ( ${plan_id}, ${viaje_id}, ${lentrega}) RETURNING vremito_id;`
}

export function viajeDetalleDupSQL(desglose_id: number,rt_id: number,raciones: number,reparto_id: number) {
    return `INSERT INTO public.viaje_detalle(desglose_id, vremito_id, raciones,reparto_id) VALUES (${desglose_id}, ${rt_id}, ${raciones},${reparto_id});`
}

export function getEnviosIDSQL (remito:number) {
    return `SELECT envio_id FROM public.envio WHERE remito_id = ${remito};`
}

export function deleteEnvioDetSQL (envio:number) {
    return `DELETE FROM public.envio_details WHERE envio_id = ${envio};`
}

export function deleteEnvioSQL (envio:number) {
    return `DELETE FROM public.envio WHERE envio_id = ${envio};`
}

export function deleteRemitoSQL (remito:number) {
    return `DELETE FROM public.remito WHERE remito_id = ${remito};`
}

export function enviosExcelSQL (userId:number) {
    return `
        SELECT r.fecha_creado,r.fecha_despachado,r.fecha_preparado,
        r.fecha_entregado,r.fortificado,es.des as estado,
        r.pv,r.numero,des.des as dependencia,r.lentrega_id as lugar_entrega
        FROM public.envio e
        JOIN public.desglose des ON e.desglose_id = des.desglose_id
        JOIN public.remito r ON e.remito_id = r.remito_id 
        JOIN public.estado es ON r.estado_id = es.estado_id  
        WHERE r.reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${userId});
        `
}

export function addRepartoSQL (plan:number,year:number) {
    return `INSERT INTO public.reparto(numero, periodo) VALUES (${plan}, ${year});`
}

export function dataExcelViajesSQL (userId:number) {
    return `
    SELECT v.viaje_id,de.cue,l.lentrega_id,l.completo,de.des as dependencia,l.localidad,l.departamento,l.direccion,p.dias,p.des as plan,d.raciones
    FROM public.viaje v JOIN public.viaje_remito r ON v.viaje_id = r.viaje_id 
    JOIN public.viaje_detalle d ON d.vremito_id = r.vremito_id
    JOIN public.desglose de ON de.desglose_id = d.desglose_id
    JOIN public.lentrega l ON de.lentrega_id = l.lentrega_id
    JOIN public.plan p ON p.plan_id = r.plan_id 
    WHERE v.reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${userId})
    ORDER BY d.detalle_id;
    `
}

export function getAllUsersSQL () {
    return `SELECT * FROM public."user" ORDER BY "userId" ASC;`
}

export function userEditSQL (column: string,ins: number,value:string) {
    return `UPDATE public.user SET ${column}=${parseInt(value) ? `${value}` : `'${value}'`} WHERE "userId" = ${ins};`
}

export function createUserSQL (u: IUsuario) {
    return `INSERT INTO public."user"(username, email, password, rol) VALUES ('${u.username}', '${u.email}', '${u.password}', ${u.rol}) RETURNING "userId";`
}

export function viajesDespachadosSQL (u: number) {
    return `SELECT v.viaje_id FROM public.remito r JOIN public.viaje v ON v.viaje_id = r.viaje_id 
            WHERE r.despachado = true AND v.reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${u}) 
            GROUP BY v.viaje_id;`
}

export function remitosNoDespachadoInsSQL (user: number) {
    return `SELECT d.ins_id, SUM(d.unidades) FROM public.remito r JOIN public.envio e ON r.remito_id = e.remito_id 
            JOIN public.envio_details d ON e.envio_id = d.envio_id 
            WHERE r.despachado = false AND r.reparto_id = (SELECT reparto_id FROM reparto_user WHERE user_id = ${user}) 
            GROUP BY d.ins_id;`
}

export function viajeJoinSQL () {
    return `UPDATE public.viaje_remito SET viaje_id = $1 WHERE viaje_id = $2;`
}

export function viajeDelSQL() {
    return `DELETE FROM public.viaje WHERE viaje_id = $1`
}

export function createPlanNewUserSQL () {
    return `INSERT INTO public.reparto_user(reparto_id, user_id) VALUES ((SELECT MAX(reparto_id) FROM public.reparto), $1);`
}

export function getAllNonExportedRtsSQL () {
    return `SELECT r.remito_id,r.pv, r.numero, d.ins_id,r.lentrega_id,i.des,i.cod1,i.cod2,i.cod3, SUM(unidades) as unidades FROM public.remito r 
            JOIN public.envio e ON r.remito_id = e.remito_id 
            JOIN public.envio_details d ON e.envio_id = d.envio_id
			JOIN public.insumo i ON i.ins_id = d.ins_id
            WHERE r.despachado = true AND r.exportado = false GROUP BY r.remito_id,r.pv,r.numero, d.ins_id, r.lentrega_id,i.des,i.cod1,i.cod2,i.cod3
            ORDER BY r.remito_id;`
}

export function exportRemitosSQL (remitos:IRemitoNoExportedRQ[]) {
    
    let ids = ""
    remitos.forEach((rt,i) => {
        if(i === 0) ids += rt.remito_id+""
        else ids += ","+rt.remito_id
    });
    return `UPDATE public.remito SET exportado = true WHERE remito_id IN (${ids});`
}

export function editvremitoPlan ()  {
    return `UPDATE public.viaje_remito SET plan_id=$1 WHERE vremito_id = $2;`
}