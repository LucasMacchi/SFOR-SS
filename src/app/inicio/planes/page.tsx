import PlanesDisplay from "@/Componets/PlanesDisplay"
import DBEditPlanDays from "@/db/DBEditPlanDays"
import DBInsumos from "@/db/DBInsumos"
import DBPlanReparto from "@/db/DBPlanReparto"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"





export default async function Page () {
    await sessionCheck()
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

    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>PLANES</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <PlanesDisplay planes={planes ? planes : []} editDaysFn={editDaysFn}/>
            </div>
        </div>
    )
}