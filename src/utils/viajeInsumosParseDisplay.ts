import { IDesgloseParsed, IEnvioDetallesParsed, IInsumo, IPlan, IViajeRemito } from "./interfaces";

export default function (insumos: IInsumo[],planes: IPlan[], remitos: IViajeRemito[]) {

    const detalles: IDesgloseParsed[] = []

    remitos.forEach(r => {
        planes.forEach(p => {
            if(p.plan_id === r.plan_id) {
                r.detalles.forEach((rd) => {
                    const racionesT = rd.raciones * p.dias
                    const arrDetallesIns: IEnvioDetallesParsed[] = []
                    p.detalles.forEach(pd => {
                        insumos.forEach(ins => {
                            if(ins.ins_id === pd.ins_id) {
                                const unidadesN = Math.ceil((rd.raciones * pd.dias) / ins.racunidad) 
                                let cajasN = unidadesN >= ins.unidades_caja ? Math.floor(unidadesN / ins.unidades_caja) : 0
                                arrDetallesIns.push({
                                    unidades: unidadesN,
                                    bolsas: unidadesN - (cajasN* ins.unidades_caja),
                                    raciones: unidadesN * ins.racunidad,
                                    cajas: cajasN,
                                    kilos: unidadesN * ins.gr_unidad / 1000,
                                    palet: 0,
                                    ins_id: ins.ins_id,
                                    des: ins.des
                                })
                            }
                        });
                    });
                    detalles.push({
                        envio_id: rd.desglose_id,
                        raciones: racionesT,
                        dependencia: "DESGLOSE",
                        detalles: arrDetallesIns
                    })
                })
            }
        });
    });
    const allDetalles:IEnvioDetallesParsed[] = []
    const insumosP: IEnvioDetallesParsed[] = []
    detalles.forEach(element => {
        element.detalles.forEach((d) => allDetalles.push(d))
    });
    let leches = 0
    detalles.forEach(d => {
        leches += d.raciones ? d.raciones  : 0
    });
    console.log("TOTALES = "+leches)
    insumos.forEach(i => {
        const ins: IEnvioDetallesParsed = {
            unidades: 0,
            bolsas: 0,
            raciones: 0,
            cajas: 0,
            kilos: 0,
            palet: 0,
            ins_id: i.ins_id,
            des: i.des
        }
        allDetalles.forEach(d => {
            if(d.ins_id === i.ins_id) {
                ins.bolsas += d.bolsas
                ins.cajas += d.cajas
                ins.raciones += d.raciones
                ins.unidades += d.unidades
                ins.kilos += d.kilos
            }
        });
        const cajasToAdd = ins.bolsas >= i.unidades_caja ? Math.floor(ins.bolsas / i.unidades_caja) : 0
        ins.bolsas = cajasToAdd > 0 ? ins.bolsas - cajasToAdd * i.unidades_caja : ins.bolsas
        ins.cajas +=cajasToAdd
        if(ins.unidades > 0) console.log(ins)
        const paletsToAdd = ins.cajas >= i.caja_palet ? Math.floor(ins.cajas / i.caja_palet) : 0
        ins.cajas = paletsToAdd > 0 ? ins.cajas - paletsToAdd * i.caja_palet : ins.cajas
        ins.palet += paletsToAdd
        ins.unidades = ins.bolsas + ins.cajas * i.unidades_caja + ins.palet * i.caja_palet * i.unidades_caja
        ins.raciones = ins.unidades * i.racunidad
        ins.kilos = ins.unidades * i.gr_unidad / 1000
        if(ins.unidades > 0) console.log(ins)
        if(ins.unidades > 0) insumosP.push(ins)
    });
    const total:IEnvioDetallesParsed = {
        unidades: 0,
        bolsas: 0,
        raciones: 0,
        cajas: 0,
        kilos: 0,
        palet: 0,
        ins_id: 0,
        des: "TOTAL"
    }
    insumosP.forEach(i => {
        total.unidades += i.unidades
        total.bolsas += i.bolsas
        total.raciones += i.raciones
        total.cajas += i.cajas
        total.kilos += i.kilos
        total.palet += i.palet ? i.palet : 0
    });
    insumosP.push(total)

    return insumosP

}