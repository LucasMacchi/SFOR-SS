import DBJoinViajes from "@/db/DBJoinViajes";
import DisplayViajes from "@/Componets/DisplayViajes";
import ViajeAdd from "@/Componets/ViajeAdd";
import DBActivarViaje from "@/db/DBActivarViaje";
import DBAddDetalleViaje from "@/db/DBAddDetalleViaje";
import DBCreateViaje from "@/db/DBCreateViaje";
import DBDeleteViaje from "@/db/DBDeleteViaje";
import DBDepartamentos from "@/db/DBDepartamentos";
import DBDuplicateViaje from "@/db/DBDuplicateViaje";
import DBEscuelas from "@/db/DBEscuelas";
import DBInsumos from "@/db/DBInsumos";
import DBPlanActual from "@/db/DBPlanActual";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBViajes from "@/db/DBViajes";
import { IViaje, IViajeDetalle, IViajeDetalleRQ, IViajeRQ } from "@/utils/interfaces";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";
import DBEditPlanVRemito from "@/db/DBEditPlanVRemito";




export default async function Page () {
    await sessionCheck(2)
    const lugares = await DBEscuelas(true,false)
    const plan = await DBPlanActual()
    const departamentos = await DBDepartamentos()
    const insumos = await DBInsumos()
    const planes = await DBPlanReparto()
    const viajes = await DBViajes()
    const desglosesViajes: IViajeDetalleRQ[] = []
    viajes.forEach(v => {
        v.remitos.forEach((r) => {
            r.detalles.forEach((d) => {
                desglosesViajes.push(d)
            })
        })
    });
    lugares.forEach(lgs => {
        if(lgs.desgloses) {
            desglosesViajes.forEach(dv => {
                if(lgs.desgloses){
                    lgs.desgloses.forEach((d) => {
                        if(dv.desglose_id === d.desglose_id) d.selected = true
                    })
                }
            });
        }
    });

    const updateDesgloses = async () => {
        "use server"
        try {
            const lugaresU = await DBEscuelas(true,false)
            lugaresU.forEach(lgs => {
                if(lgs.desgloses) {
                    desglosesViajes.forEach(dv => {
                        if(lgs.desgloses){
                            lgs.desgloses.forEach((d) => {
                                if(dv.desglose_id === d.desglose_id) d.selected = true
                            })
                        }
                    });
                }
            });
            return lugaresU
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const createViajeFn = async (v: IViaje):Promise<boolean> =>  {
        "use server"
        try {
            const res = await DBCreateViaje(v)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const editVRemitoFn = async (vremito: number,plan: number):Promise<boolean> =>  {
        "use server"
        try {
            const res = await DBEditPlanVRemito(vremito,plan)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }


    const createExportFn = async (v: IViajeRQ,reparto: number):Promise<boolean> =>  {
        "use server"
        try {
            const res = await DBDuplicateViaje(v,reparto)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const deleteViajeFn = async (id:number,table:string,column: string):Promise<boolean> =>  {
        "use server"
        try {
            const res = await DBDeleteViaje(id,table,column)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const addDetalleViaje = async (detail:IViajeDetalle,id:number):Promise<boolean> =>  {
        "use server"
        try {
            const res = await DBAddDetalleViaje(detail,id)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const changeStateViajeFn = async (id:number,state:boolean):Promise<boolean> => {
        "use server"
        try {
            const res = await DBActivarViaje(id,state)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const joinViajes = async (viaje: number, nuevo:number):Promise<boolean> => {
        "use server"
        try {
            const res = await DBJoinViajes(viaje,nuevo)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    return (
        <div style={{marginLeft: 25, marginBottom: 100}}>
            <div>
                <h2 style={text_2_t_style}>VIAJES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <DisplayViajes viajes={viajes} 
                deleteFn={deleteViajeFn} planes={planes ? planes : []} 
                insumos={insumos} lugares={lugares} 
                activarViajeFn={changeStateViajeFn}
                addViajeDetalleFn={addDetalleViaje} repartos={plan}
                duplicateViajeFn={createExportFn} unirViajesFn={joinViajes}
                editVRemitoFn={editVRemitoFn}/>
            </div>
            <div>
                <h2 style={text_2_t_style}>CREAR VIAJE</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <ViajeAdd escuelas={lugares} departamentos={departamentos} 
                planes={planes ? planes : []} 
                insumos={insumos} addViajeFn={createViajeFn}
                updateDesglose={updateDesgloses}/>
            </div>
        </div>
    )
}