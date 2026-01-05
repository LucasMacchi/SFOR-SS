"use client"
import { IFacturasExcel } from "@/utils/interfaces";
import Image from "next/image"
import * as XLSX from 'xlsx';


export default function FacturasEachExcel ({getEachFacturasFn}:{getEachFacturasFn: () => Promise<IFacturasExcel[]>}) {

    const color = "#32CD32"

    const createExcel = async () => {
        const data = await getEachFacturasFn()
        if(data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data[0].detalles)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook,worksheet,data[0].factura)
            data.forEach((v,i) => {
                if(i > 0) {
                    const worksheetI = XLSX.utils.json_to_sheet(v.detalles)
                    XLSX.utils.book_append_sheet(workbook,worksheetI,v.factura)
                }
            });
            XLSX.writeFile(workbook,'FACTURAS_ALL_DIV.xlsx')
        }
        else alert("Error al traer las facturas o no existen.")
    }

    return(
        <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}}
        onClick={() => createExcel()}>
            <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
            EXCEL DE FACTURAS DIVIDIDO
        </button>
    )
}