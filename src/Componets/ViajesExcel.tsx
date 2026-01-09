"use client"
import {IViajeExcelComplete, IViajeExcelRQ } from "@/utils/interfaces";
import Image from "next/image"
import * as XLSX from 'xlsx';


export default function ViajesExcel ({getViajeDataExcelFn}:{getViajeDataExcelFn: () => Promise<IViajeExcelComplete[]>}) {

    const color = "#32CD32"

    const createExcel = async () => {
        const data = await getViajeDataExcelFn()
        if(data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data[0].detalles)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook,worksheet,data[0].name)
            data.forEach((v,i) => {
                if(i > 0) {
                    const worksheetI = XLSX.utils.json_to_sheet(v.detalles)
                    XLSX.utils.book_append_sheet(workbook,worksheetI,v.name+""+i)
                }
            });
            XLSX.writeFile(workbook,'VIAJES_ALL.xlsx')
        }
        else alert("Error al traer los envios o no existen.")
    }

    return(
        <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}}
        onClick={() => createExcel()}>
            <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
            EXCEL DE VIAJES DEL PLAN ACTUAL
        </button>
    )
}