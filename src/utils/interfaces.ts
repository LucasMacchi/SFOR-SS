
export interface IRqLogin {
    username: string,
    password: string
}
export interface IRqUniq {
    pv:number,
    numero:number
}
export interface IRqRepUserChange {
    repartoId: number
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
    reportes: number
}

export interface IReporteRemito {
    reporte_id: number,
    remito: string,
    titulo: string,
    des: string,
    fecha: string,
    reportes: number
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
