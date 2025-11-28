import FilterRemito from "@/Componets/FilterRemito";
import SearchRemito from "@/Componets/searchRemito";
import DBEstados from "@/db/DBEstados";
import DBRemitos from "@/db/DBRemitos";
import sessionCheck from "@/utils/sessionCheck";

export default async function Page() {

    await sessionCheck()
    const remitos = await DBRemitos()
    const estados = await DBEstados()
    return (
        <div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <SearchRemito />
            </div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <FilterRemito key={"filter-view"} remitos={remitos} estados={estados}/>
            </div>
        </div>
    )
}