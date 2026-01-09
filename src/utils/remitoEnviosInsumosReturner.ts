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
            cajaxund: ins.unidades_caja,
            des: ins.des,
            calculable: ins.calculable
        }
        envios.forEach(envio => {
            envio.detalles.forEach((dt) => {
                if(dt.ins_id === ins.ins_id) {
                    
                    insumo.unidades += dt.unidades
                    insumo.raciones += dt.raciones
                    insumo.cajas = 0
                    insumo.bolsas = 0 // dt.unidades - cajas * ins.unidades_caja
                    insumo.kilos += dt.unidades * ins.gr_unidad / 1000

                }
            })
        })
        if(insumo.unidades > 0) detalles.push(insumo)
    })

    detalles.forEach(d => {
        const cajas = (d.cajaxund > 0 && d.unidades >= d.cajaxund) ? Math.floor(d.unidades / d.cajaxund) : 0
        d.cajas = cajas
        d.bolsas = d.unidades - cajas * d.cajaxund
    });
    console.log(detalles)
    return detalles

}