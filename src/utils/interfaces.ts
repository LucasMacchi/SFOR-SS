import { ROLES } from "./enums"

export interface IRqLogin {
    username: string,
    password: string
}
export interface IRqUniq {
    pv:number,
    numero:number
}
export interface IRqStChange {
    estado_id: number,
    estado: string,
    remito: number
}
export interface IRqReportAdd {
    categoria_id: number,
    descripcion: string,
    remito_id: number
}
export interface IRqRepUserChange {
    repartoId: number
}
export interface IConfigTable {
    config_id: number,
    des: string,
    payload: string
}
export interface IUserData {
    email: string,
    username: string,
    userId: number,
    rol:number
}
export interface IDesgloseDisplay {
    envio_id: number,
    dependencia:string,
    detalles: IEnvioDetalles[]
}

export interface IAddRemito {
    estado_id: number,
    lentrega_id:number,
    fortificado:boolean,
    reparto_id: number,
    dias:number,
    fecha_creado:string,
    viaje_id:number | null,
    envios:IAddEnvio[]
}

export interface IAddEnvio {
    envio_id?:number,
    remito_id:number,
    desglose_id:number,
    tanda: number,
    fortificado: boolean,
    detalles: IEnvioDetalles[]
}

export interface IEnvioDetalles {
    detail_id?: number,
    envio_id: number,
    ins_id: number,
    insumo: string,
    unidades: number,
    raciones: number
}

export interface IInsumo {
    ins_id: number,
    cod1: number,
    cod2: number,
    cod3: number | null,
    des: string,
    caja_palet: number,
    gr_racion: number,
    gr_unidad: number,
    unidades_caja: number,
    racunidad: number,
    raccaja:number,
    calculable:boolean,
    stock:number,
    [key: string]: any

}
export interface ICreateInsumo {
    cod1:number,
    cod2:number,
    cod3:number,
    des:string,
    caja_palet:number,
    gr_racion:number,
    gr_total:number,
    unitades_caja:number,
    rac_unidad:number,
    rac_caja:number,
    calculable:boolean
}
export interface IDesgloseParsed {
    envio_id: number,
    dependencia:string,
    raciones?:number
    detalles: IEnvioDetallesParsed[]

}
export interface IRemitosDetalles {
    unidades: number,
    raciones: number,
    bolsas:number,
    cajas:number,
    kilos:number,
    des: string,
    calculable?:boolean
}
export interface IEnvioDetallesParsed {
    unidades: number,
    bolsas: number,
    raciones: number,
    cajas: number,
    kilos: number,
    palet: number,
    ins_id: number,
    des: string
}
export interface IReporte {
    reporte_id: number,
    categoria_id: number,
    descripcion: string,
    titulo: string,
    fecha: Date
}
export interface IUniqRemito {
    remito_id:number,
    pv:number,
    numero:number,
    estado_id: number,
    estado: string,
    fortificado: boolean,
    dias: number,
    fecha_creado: Date,
    fecha_preparado: Date,
    fecha_despachado: Date,
    lentrega_id: number,
    departamento: string,
    fecha_entregado: Date,
    localidad: string,
    numf: number,
    pvf: number,
    cabecera: string,
    periodo: number,
    reportes: number,
    direccion: string
}

export interface IReporteRemito {
    reporte_id: number,
    remito: string,
    titulo: string,
    des: string,
    fecha: string,
    reportes: number
}

export interface IReporteCategoria {
    categoria_id : number,
    des: string
}

export interface IRemitosEnvio {
    remito_id:number,
    pv:number,
    numero:number,
    estado_id: number,
    estado: string,
    fortificado: boolean,
    dias: number,
    fecha_creado: Date,
    fecha_preparado: Date,
    fecha_despachado: Date,
    lentrega_id: number,
    departamento: string,
    localidad: string,
    numf: number,
    pvf: number,
    cabecera: string,
    numRep: number,
    periodo: number,
    pernumero: number,
    fecha_entregado: Date,
    reportes: number,
    checked:boolean,
    viaje_id:number

}
export interface IRemitoFacturacionResponse {
    des: string,
    sum: string
}

export interface IEstados {
    estado_id: number,
    des: string
}

export interface IReparto {
    reparto_id : number,
    numero: number,
    periodo: number
}

export interface IFactura {
    factura_id:number,
    remito_id:number,
    raciones:number,
    fecha_factura:Date,
    fecha_creado:Date,
    numero:number,
    pv:number
}

export interface IFacturaAgrupado {
    pv:number,
    numero: number,
    cerrado: boolean,
    raciones: number,
    fecha_factura: Date,
    remitos?: IRemitoInFactura[]
}

export interface IRemitoInFactura {
    pv:number,
    numero:number,
    raciones:number,
    remito_id: number,
    completo: string,
    factura?:string
}



export interface IRemitosNoF {
    remito_id: number,
    pv:number,
    numero:number,
    fortificado: boolean,
    raciones?: string
}

export interface IAddFactura {
    raciones: number,
    remito_id:number,
    fecha_factura:string,
    numero:number,
    pv:number
}

export interface IExcelFactura {
    REMITO:string,
    CABECERA: string,
    RACIONES: number,
    FACTURA?:string
}

export interface IExcelRemito {
    REMITO:string,
    ESTADO: string,
    TIPO: string,
    DIAS: number,
    FECHA_CREADO: string,
    FECHA_PREPARADO: string,
    FECHA_DESPACHADO: string,
    FECHA_ENTREGADO: string,
    LUGARID: number,
    DEPARTAMENTO: string,
    LOCALIDAD: string,
    FACTURA: string,
    CABECERA: string,
    PLAN: string,
}

export interface IPlan {
    dias:number,
    fortificado: boolean,
    plan_id: number,
    des: string,
    detalles: IPlanDetails[]
}

export interface IPlanDetails {
    detail_id: number,
    ins_id: number,
    dias: number,
    plan_id: number,
    des: string
}

export interface IAddPlanDetails {
    ins_id: number,
    dias: number,
    plan_id?:number,
    des: string
}

export interface IAddPlan {
    days: number,
    descripcion: string,
    fortificado:boolean
}

export interface ILentrega {
    lentrega_id: number,
    localidad: string,
    departamento:string,
    completo: string,
    direccion: string,
    descripcion: string,
    desgloses?:IDesglose[],
}

export interface IDesglose {
    desglose_id: number,
    lentrega_id: number,
    cue: string,
    des: string,
    raciones: number,
    fortificado: boolean,
    visible: boolean,
    enviado: boolean,
    selected: boolean
    [key: string]: any
}

export interface IDepartamento {
    departamento: string
}

export interface IAddDesglose {
    lentrega_id: number,
    cue: number,
    des: string,
    raciones: number,
    fortificado: boolean
}

export interface IViaje {
    des: string,
    remitos: IViajeRemito[],
    viaje_id?:number
}

export interface IViajeRemito {
    plan_id: number,
    lenterga_id:number,
    detalles: IViajeDetalle[],
    vremito_id?:number
}

export interface IViajeDetalle {
    desglose_id: number,
    raciones: number,
    detalle_id?:number,
}

export interface IViajeRQ {
    des: string,
    remitos: IViajeRemitoRQ[],
    viaje_id:number,
    reparto_id: number,
    procesado:boolean
}

export interface IViajeRemitoRQ {
    vremito_id:number,
    plan_id:number,
    lentrega_id:number,
    completo:string,
    departamento:string,
    des: string,
    dias:number
    detalles: IViajeDetalleRQ[]
}

export interface IViajeDetalleRQ {
    detalle_id:number,
    desglose_id:number,
    vremito_id:number,
    raciones:number,
    des:string
}

export interface IRemitoT {
    remito_id:number,
    pv:number,
    numero:number,
    estado_id:number,
    descipcion: string,
    direccion:string,
    lentrega_id:number,
    dias:number,
    viaje_id:number,
    fortificado: boolean,
    completo:string,
    plan_id:number,
    localidad:string,
    envios:IEnvioT[],
}
export interface IEnvioT {
    envio_id:number,
    remito_id:number,
    desglose_id:number,
    des: string,
    fortificado: boolean,
    detalles: IEnvioDetalles[]
}

export interface IStockLog {
    log_id: number,
    unidades_prev: number,
    unidades_new: number,
    fecha: Date,
    descripcion:string,
    insumo:string,
    cod1:number,
    cod2:number,
    cod3:number,
    ins_id: number
}

export interface IStockAdd {
    ins_id: number,
    value: number,
    sum: boolean,
    des:string,
    title: string
}

export interface IRemitoUnids {
    pv: number,
    numero: number,
    ins_id: number,
    unidades:number
}

export interface IEnviosDel {
    envio_id:number
}

export interface IStockExcel {
    COD1: number,
    COD2: number,
    COD3: number,
    INSUMO: string,
    STOCK: number
}

export interface IStockLogExcel {
    FECHA: string,
    DESCRIPCION:string,
    PREVIO:number,
    POSTERIOR:number
}

export interface IEnviosExcelRQ {
    fecha_creado: Date,
    fecha_despachado:Date,
    fecha_preparado:Date,
    fecha_entregado:Date,
    fortificado:boolean,
    estado:string,
    pv:number,
    numero:number,
    dependencia:string,
    lugar_entrega:number
}

export interface IEnviosExcel {
    R_PV:number,
    R_NUMERO:number,
    R_CREADO:string,
    R_PREPARADO:string,
    R_DESPACHADO:string,
    R_ENTREGADO:string,
    R_TIPO:string,
    R_ESTADO:string,
    E_DEPENDENCIA:string,
    E_ID_ENTREGA:number
}

export interface IViajeExcelComplete {
    name:string,
    detalles: IViajeExcel[]
}

export interface IViajeExcelRQ {
    cue: number,
    lentrega_id: number,
    completo:string,
    dependencia:string,
    localidad:string,
    departamento:string,
    direccion:string,
    dias:number,
    plan:string,
    raciones: number,
    viaje_id: number
}

export interface IViajeExcel {
    CUE:number,
    ID: number,
    CABECERA:string,
    DEPENDENCIA:string,
    LOCALIDAD:string,
    DEPARTAMENTO:string,
    DIRECCION:string,
    DIAS:number,
    PLAN:string,
    RACIONES:number,
    RACIONES_TOTAL:number
}
