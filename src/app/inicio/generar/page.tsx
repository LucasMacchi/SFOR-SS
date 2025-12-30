

import GenerarIndividual from "@/Componets/GenerarIndividual";
import DBDepartamentos from "@/db/DBDepartamentos";
import DBEscuelas from "@/db/DBEscuelas";
import DBGenerateRemitoPlan from "@/db/DBGenerateRemitoPlan";
import DBInsumos from "@/db/DBInsumos";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBUserPlan from "@/db/DBUserPlan";
import { IAddRemito } from "@/utils/interfaces";
import sessionCheck from "@/utils/sessionCheck";
import { hr_style, text_2_t_style } from "@/utils/styles";



export default async function Page() {
    await sessionCheck(2)
    const insumos = await DBInsumos()
    const planes = await DBPlanReparto()
    const lugares = await DBEscuelas(true,false)
    const departamentos = await DBDepartamentos()
    const userplan = await DBUserPlan()
    
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
                <div>
                    <GenerarIndividual escuelas={lugares} 
                    departamentos={departamentos} 
                    planes={planes ?planes:[]} insumos={insumos} reparto={userplan}
                    generateFn={generateRemitosViaje}/>
                </div>
            </div>

        </div>
    )
}