"use client"
import {IExcelFactura, IViajeExcelComplete, IViajeExcelRQ } from "@/utils/interfaces";
import Image from "next/image"
import * as XLSX from 'xlsx';


export default function FacturasExcel ({getFacturasDataExcelFn}:{getFacturasDataExcelFn: () => Promise<IExcelFactura[]>}) {

    const color = "#32CD32"

    const createExcel = async () => {
        const data = await getFacturasDataExcelFn()
        if(data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook,worksheet,"FACTURAS")
            XLSX.writeFile(workbook,'FACTURAS.xlsx')
        }
        else alert("Error al traer las facturas o no existen.")
    }

    return(
        <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}}
        onClick={() => createExcel()}>
            <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
            EXCEL DE FACTURAS
        </button>
    )
}