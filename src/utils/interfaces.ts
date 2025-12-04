
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
    userId: number
}
export interface IDesgloseDisplay {
    envio_id: number,
    dependencia:string,
    detalles: IEnvioDetalles[]
}
export interface IEnvioDetalles {
    detail_id: number,
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
    calculable:boolean

}
export interface IDesgloseParsed {
    envio_id: number,
    dependencia:string,
    detalles: IEnvioDetallesParsed[]

}
export interface IRemitosDetalles {
    unidades: number,
    raciones: number,
    bolsas:number,
    cajas:number,
    kilos:number,
    des: string
}
export interface IEnvioDetallesParsed {
    unidades: number,
    bolsas: number
    raciones: number,
    cajas: number,
    kilos: number,
    palet?: number,
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
    reportes: number

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