import { IDesgloseDisplay, IDesgloseParsed, IInsumo, IRemitosDetalles } from "./interfaces";



export function parsedDesgloseDetalles(insumos: IInsumo[],d: IDesgloseDisplay) : IDesgloseParsed {
    const parsed: IDesgloseParsed = {
        envio_id: d.envio_id,
        dependencia: d.dependencia,
        detalles: []
    }
    d.detalles.forEach(det => {
        insumos.forEach(i => {
            if(i.ins_id === det.ins_id) {
                const cajasN = det.unidades >= i.unidades_caja ? Math.floor(det.unidades / i.unidades_caja) : 0
                parsed.detalles.push({
                    unidades: det.unidades,
                    raciones: det.raciones,
                    cajas: cajasN,
                    bolsas: det.unidades - (cajasN* i.unidades_caja),
                    kilos: det.unidades * i.gr_unidad / 1000,
                    ins_id: i.ins_id,
                    des: i.des,
                    palet: 0
                })
            }
        });
    });
    return parsed
}

export function parsedRemitosDetalles (desgloses: IDesgloseDisplay[],insumos: IInsumo[]): IRemitosDetalles[] {
    const parsedDesgloses: IDesgloseParsed[] = []
    const remitoDetalles: IRemitosDetalles[] = []
    desgloses.forEach(d => {
        parsedDesgloses.push(parsedDesgloseDetalles(insumos,d))
    });
    insumos.forEach(i => {
        let total_rac = 0
        let total_un = 0
        let total_cajas = 0
        let total_kg = 0
        let total_bols = 0
        parsedDesgloses.forEach(d => {
            d.detalles.forEach(e => {
                if(e.ins_id === i.ins_id) {
                    total_rac += e.raciones
                    total_un += e.unidades
                    total_cajas += e.cajas
                    total_kg += e.kilos
                    total_bols += e.bolsas
                }
            });
        })
        if(total_rac > 0) {
            remitoDetalles.push({
                unidades: total_un,
                raciones: total_rac,
                bolsas: total_bols,
                cajas: total_cajas,
                kilos: total_kg,
                des: i.des
            })
        }
    });
    return remitoDetalles
}