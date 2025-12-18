import { IEnvioT, IInsumo, IPlan, IRemitosDetalles } from "./interfaces";



export default function (insumos: IInsumo[], envios: IEnvioT[]): IRemitosDetalles[] {
    const detalles: IRemitosDetalles[] = []

    insumos.forEach((ins) => {
        const insumo: IRemitosDetalles = {
            unidades: 0,
            raciones: 0,
            bolsas:0,
            cajas:0,
            kilos:0,
            des: ins.des,
            calculable: ins.calculable
        }
        envios.forEach(envio => {
            envio.detalles.forEach((dt) => {
                if(dt.ins_id === ins.ins_id) {
                    const cajas = (ins.unidades_caja > 0 && dt.unidades >= ins.unidades_caja) ? Math.floor(dt.unidades / ins.unidades_caja) : 0
                    insumo.unidades += dt.unidades
                    insumo.raciones += dt.raciones
                    insumo.cajas += cajas
                    insumo.bolsas += dt.unidades - cajas * ins.unidades_caja
                    insumo.kilos += dt.unidades * ins.gr_unidad / 1000
                }
            })
        })
        if(insumo.unidades > 0) detalles.push(insumo)
    })
    return detalles

}