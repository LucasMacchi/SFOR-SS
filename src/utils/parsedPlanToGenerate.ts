import { IAddEnvio, IAddRemito, IEnvioDetalles, IInsumo, IPlan, IViajeRQ } from "./interfaces";



export default function (viaje: IViajeRQ,planes: IPlan[],insumos:IInsumo[]) {

    try {
        const remitos: IAddRemito[] = []

        viaje.remitos.forEach(rv => {
            const plan = planes.find(pls => pls.plan_id === rv.plan_id)
            if(!plan) throw Error("PLAN NO ENCOTRADO")
            const remitoAdd:IAddRemito = {
                estado_id: 1,
                lentrega_id: rv.lentrega_id,
                fortificado: plan.fortificado,
                dias: plan.dias,
                reparto_id: viaje.reparto_id,
                viaje_id: viaje.viaje_id,
                fecha_creado: 'NOW()',
                envios: []
            }
            const envios: IAddEnvio[] = []
            rv.detalles.forEach(d => {
                const detallesAdd: IAddEnvio = {
                    remito_id: 0,
                    desglose_id: d.desglose_id,
                    tanda: 0,
                    fortificado: plan.fortificado,
                    detalles: []
                }
                const enviosDetalles: IEnvioDetalles[] = []
                plan.detalles.forEach(pd => {
                    insumos.forEach(ins => {
                        if(pd.ins_id === ins.ins_id) {
                            const racIns = d.raciones * pd.dias
                            enviosDetalles.push({
                                envio_id: 0,
                                ins_id: ins.ins_id,
                                insumo: ins.des,
                                unidades: Math.ceil(racIns / ins.racunidad),
                                raciones: Math.ceil(racIns / ins.racunidad) * ins.racunidad
                            })
                        }
                    })
                });
                detallesAdd.detalles = enviosDetalles
                envios.push(detallesAdd)
            });
            remitoAdd.envios = envios
            remitos.push(remitoAdd)
        });


        return remitos
    } catch (error) {
        console.log(error)
        throw Error ("Error al generar envio.")
    }

}

