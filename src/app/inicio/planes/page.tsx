import PlanesDisplay from "@/Componets/PlanesDisplay"
import DBAddDetailsPlan from "@/db/DBAddDetailsPlan"
import DBAddPlan from "@/db/DBAddPlan"
import DBDeleteDetailPlan from "@/db/DBDeleteDetailPlan"
import DBEditPlanDays from "@/db/DBEditPlanDays"
import DBInsumos from "@/db/DBInsumos"
import DBPlanReparto from "@/db/DBPlanReparto"
import { IAddPlan, IAddPlanDetails } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"





export default async function Page () {
    await sessionCheck(2)
    const insumos = await DBInsumos()
    const planes = await DBPlanReparto()

    const editDaysFn = async (detail_id:number,days:number): Promise<boolean> => {
        "use server"
        try {
            const res = await DBEditPlanDays(detail_id,days)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const createPlan = async (plan: IAddPlan,details:IAddPlanDetails[]):Promise<boolean> => {
        "use server"
        try {
            const res = await DBAddPlan(plan,details)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const addDetailPlan = async (detail:IAddPlanDetails):Promise<boolean> => {
        "use server"
        try {
            const res = await DBAddDetailsPlan(detail)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const deleteDetailPlan = async (detail_id:number):Promise<boolean> => {
        "use server"
        try {
            const res = await DBDeleteDetailPlan(detail_id)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>PLANES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <PlanesDisplay planes={planes ? planes : []} 
                editDaysFn={editDaysFn} insumos={insumos} 
                addPlanFn={createPlan} addDetailFn={addDetailPlan}
                deleteDetailFn={deleteDetailPlan}/>
            </div>
        </div>
    )
}