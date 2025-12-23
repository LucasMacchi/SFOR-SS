import { IDesgloseParsed, IEnvioDetalles, IEnvioDetallesParsed, IEnvioT, IInsumo, IPlan, IRemitoT, IViajeRemitoRQ } from "./interfaces";

export default function (insumos: IInsumo[], r: IRemitoT[]) {

    const detalles: IEnvioDetallesParsed[] = []
    const enviosTotales:IEnvioT[] = []
    const detallesTotales: IEnvioDetalles[] = []

    r.forEach(rt => {
        rt.envios.forEach((e) => enviosTotales.push(e))
    });
    enviosTotales.forEach(e => {
        e.detalles.forEach(dt => detallesTotales.push(dt))
    });

    insumos.forEach(i => {
        const dt: IEnvioDetallesParsed = {
            unidades: 0,
            bolsas: 0,
            raciones: 0,
            cajas: 0,
            kilos: 0,
            palet: 0,
            ins_id: i.ins_id,
            des: i.des
        }
        detallesTotales.forEach((dts) => {
            if(i.ins_id === dts.ins_id) {
                dt.unidades += dts.unidades
                dt.raciones += dts.raciones
            }
        })
        let cajas = dt.unidades >= i.unidades_caja ? Math.floor(dt.unidades / i.unidades_caja) : 0
        const unidades = cajas ? dt.unidades - cajas  * i.unidades_caja : dt.unidades
        const palets = cajas ? Math.floor(cajas / i.caja_palet) : 0
        cajas = palets ? cajas - palets * i.caja_palet : cajas
        dt.cajas = cajas
        dt.palet = palets
        dt.unidades = cajas * i.unidades_caja + palets * i.caja_palet * i.unidades_caja + unidades
        dt.bolsas = unidades
        dt.kilos = dt.unidades * i.gr_unidad / 1000
        if(dt.unidades > 0) detalles.push(dt)
    });
    console.log(detalles)

}