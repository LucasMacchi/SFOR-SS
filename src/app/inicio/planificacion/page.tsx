import DisplayViajes from "@/Componets/DisplayViajes";
import ViajeAdd from "@/Componets/ViajeAdd";
import DBAddDetalleViaje from "@/db/DBAddDetalleViaje";
import DBCreateViaje from "@/db/DBCreateViaje";
import DBDeleteViaje from "@/db/DBDeleteViaje";
import DBDepartamentos from "@/db/DBDepartamentos";
import DBEscuelas from "@/db/DBEscuelas";
import DBInsumos from "@/db/DBInsumos";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBViajes from "@/db/DBViajes";
import { IViaje, IViajeDetalle } from "@/utils/interfaces";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";




export default async function Page () {
    await sessionCheck(2)
    const lugares = await DBEscuelas(true)
    const departamentos = await DBDepartamentos()
    const insumos = await DBInsumos()
    const planes = await DBPlanReparto()
    const viajes = await DBViajes()
    lugares.forEach(lgs => {
        if(lgs.desgloses) {
            lgs.desgloses.forEach(e => {
                e.selected = false
            });
        }
    });
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
    return (
        <div style={{marginLeft: 25, marginBottom: 100}}>
            <div>
                <h2 style={text_2_t_style}>VIAJES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <DisplayViajes viajes={viajes} deleteFn={deleteViajeFn} planes={planes ? planes : []} insumos={insumos} lugares={lugares} addViajeDetalleFn={addDetalleViaje}/>
            </div>
            <div>
                <h2 style={text_2_t_style}>CREAR VIAJE</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <ViajeAdd escuelas={lugares} departamentos={departamentos} planes={planes ? planes : []} insumos={insumos} addViajeFn={createViajeFn}/>
            </div>
        </div>
    )
}