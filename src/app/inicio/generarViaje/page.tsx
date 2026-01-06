import GenenarViaje from "@/Componets/GenerarViaje";
import DBGenerateRemitoPlan from "@/db/DBGenerateRemitoPlan";
import DBInsumos from "@/db/DBInsumos";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBViajes from "@/db/DBViajes";
import { IAddRemito } from "@/utils/interfaces";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";



export default async function Page() {
    await sessionCheck(2)
    const viajes = await DBViajes()
    const insumos = await DBInsumos()
    const planes = await DBPlanReparto()
    //const lugares = await DBEscuelas(true)
    //const departamentos = await DBDepartamentos()
    
    const generateRemitosViaje = async (remitos: IAddRemito[]): Promise<boolean> => {
        "use server"
        try {
            const res = await DBGenerateRemitoPlan(remitos)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    
    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>GENERAR REMITOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div style={{marginLeft: 25, marginBottom: 100}}>
                <div >
                    <GenenarViaje viajes={viajes} insumos={insumos} planes={planes ? planes : []} generarFn={generateRemitosViaje}/>
                </div>
            </div>

        </div>
    )
}