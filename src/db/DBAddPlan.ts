import clientReturner from "./clientReturner";
import { addFacturaSQL, planAddDetailSQL, planAddPlanSQL } from "./SQLreturner";
import authJwt from "@/utils/authJwt";
import { IAddPlan, IAddPlanDetails, } from "@/utils/interfaces";

export default async function (plan: IAddPlan,details:IAddPlanDetails[]): Promise<boolean> {
    const conn = clientReturner()
    try {
        if(await authJwt()) {
            await conn.connect()
            const id:number = await (await conn.query(planAddPlanSQL(plan))).rows[0]["plan_id"]
            for(const d of details) {
                d.plan_id = id
                const sql = planAddDetailSQL(d)
                await conn.query(sql)
            }
            await conn.end()
            return true
        }
        await conn.end()
        return false
    } catch (error) {
        await conn.end()
        console.log(error)
        throw new Error("Error al crear un plan.")
    }
}