"use client"
import DBExportData from "@/db/DBExportData";
import DBExportRemito from "@/db/DBExportRemito";
import exportacionTxt from "@/utils/exportacionTxt";
import { IRemitoNoExportedRQ } from "@/utils/interfaces";
import dateParser from "@/utils/txtFunctions.ts/dateParser";
import JSZip from "jszip";


export default function ExportRemitos ({getExportData,exportarRemitos}:{getExportData:()=>Promise<IRemitoNoExportedRQ[]>,exportarRemitos:(remito:IRemitoNoExportedRQ[])=>Promise<boolean>}) {

    const color = "#4A6EE8"

    const createTxt = async () => {
        if(confirm("¿Quieres exportar los remitos pendientes a exportar?")) {
            const remitos = await getExportData()
            if(remitos && remitos.length > 0 && confirm("Exportar los remitos los ocultara para la proxima exportacion.")) {
                const res = exportacionTxt(remitos)
                const zip = new JSZip();
                let cabecera = ""
                let items = ""
                res.cabecera.forEach(l => cabecera += l+"\r\n");
                res.items.forEach(l => items += l+"\r\n");

                zip.file('VCABECER.txt',cabecera)
                zip.file('VITEMS.txt',items)

                const dateNow = dateParser(new Date())

                zip.generateAsync({type: 'blob'}).then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = dateNow+'-exportacion-envio.zip';
                    link.click();
                    URL.revokeObjectURL(url);
                })

                const resEnd = await exportarRemitos(remitos)
                if(resEnd) alert("Remitos exportados.")
                else alert("Error al exportar los remitos.")
            } else alert("No hay remitos pendientes.")

        }

    }

    return(
        <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}} onClick={() => createTxt()}>
            EXPORTAR REMITOS
        </button>
    )
}