
export interface IRqLogin {
    username: string,
    password: string
}
export interface IUserData {
    email: string,
    username: string,
    userId: number
}
export interface IRemitosEnvio {
    nro_remito:string,
    estado: string,
    departamento: string,
    localidad: string,
    completo: string,
    ultima_mod: string,
    fecha: string,
    fecha_entrega: string,
    dias: number,
    fortificado: boolean,
    factura: string | null,
    raciones: number,
    reportes: number
}
export interface IRemitoFacturacionResponse {
    des: string,
    sum: string
}
