import FilterRemito from "@/Componets/FilterRemito";
import SearchRemito from "@/Componets/searchRemito";
import DBChangeRemitoStateMultiple from "@/db/DBChangeRemitoStateMultiple";
import DBEstados from "@/db/DBEstados";
import DBPlanActual from "@/db/DBPlanActual";
import DBRemitos from "@/db/DBRemitos";
import DBValorRacion from "@/db/DBValorRacion";
import DBViajes from "@/db/DBViajes";
import sessionCheck from "@/utils/sessionCheck";

export default async function Page() {

    await sessionCheck(3)
    const remitos = await DBRemitos()
    const estados = await DBEstados()
    const plan = await DBPlanActual()
    const viajes = await DBViajes()
    const valRac = await DBValorRacion()
    const updateStateMultiple = async (remitos: number[],state:number): Promise<boolean> => {
        "use server"
        try {
            await DBChangeRemitoStateMultiple(state,remitos)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    return (
        <div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <SearchRemito />
            </div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <FilterRemito viajes={viajes} key={"filter-view"} remitos={remitos} estados={estados} planes={plan} 
                stateMultipleFn={updateStateMultiple} valRac={valRac}/>
            </div>
        </div>
    )
}