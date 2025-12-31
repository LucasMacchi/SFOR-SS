"use client"
import {IViajeExcel, IViajeExcelComplete, IViajeExcelRQ } from "@/utils/interfaces";
import Image from "next/image"
import * as XLSX from 'xlsx';


export default function ViajesExcelDiv ({getViajeDataExcelDivFn}:{getViajeDataExcelDivFn: () => Promise<IViajeExcel[]>}) {

    const color = "#32CD32"

    const createExcel = async () => {
        const data = await getViajeDataExcelDivFn()
        if(data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook,worksheet,'VIAJES')
            XLSX.writeFile(workbook,'VIAJES.xlsx')
        }
        else alert("Error al traer los envios o no existen.")
    }

    return(
        <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}}
        onClick={() => createExcel()}>
            <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
            EXCEL DE VIAJES DEL PLAN ACTUAL COMBINADO
        </button>
    )
}