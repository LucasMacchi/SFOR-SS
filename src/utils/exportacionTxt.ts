import { IRemitoNoExportedRQ } from "./interfaces"
import createCabeceraTxt from "./txtFunctions.ts/txtCabecera"
import createItemTxt from "./txtFunctions.ts/txtItems"


export default function (remitos: IRemitoNoExportedRQ[]) {
    const cabecera = createCabeceraTxt(remitos)
    const items = createItemTxt(remitos)    
    return {
        cabecera,
        items
    }
}