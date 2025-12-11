import DisplayViajes from "@/Componets/DisplayViajes";
import ViajeAdd from "@/Componets/ViajeAdd";
import DBDepartamentos from "@/db/DBDepartamentos";
import DBEscuelas from "@/db/DBEscuelas";
import DBInsumos from "@/db/DBInsumos";
import DBPlanReparto from "@/db/DBPlanReparto";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";




export default async function Page () {
    await sessionCheck(2)
    const lugares = await DBEscuelas(true)
    const departamentos = await DBDepartamentos()
    const insumos = await DBInsumos()
    const planes = await DBPlanReparto()
    lugares.forEach(lgs => {
        if(lgs.desgloses) {
            lgs.desgloses.forEach(e => {
                e.selected = false
            });
        }
    });
    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>VIAJES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <DisplayViajes />
            </div>
            <div>
                <h2 style={text_2_t_style}>CREAR VIAJE</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <ViajeAdd escuelas={lugares} departamentos={departamentos} planes={planes ? planes : []}/>
            </div>
        </div>
    )
}