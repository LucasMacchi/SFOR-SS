"use client"
import {IEXCELDependencia } from "@/utils/interfaces";
import Image from "next/image"
import * as XLSX from 'xlsx';


export default function DependenciasExcelData ({getDependenciasData}:{getDependenciasData: () => Promise<IEXCELDependencia[]>}) {

    const color = "#32CD32"

    const createExcel = async () => {
        const data = await getDependenciasData()
        if(data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook,worksheet,'DEPENDENCIAS')
            XLSX.writeFile(workbook,'DEPENDENCIAS_ALL.xlsx')
        }
        else alert("Error al traer los envios o no existen.")
    }

    return(
        <button style={{fontSize: 30,backgroundColor: color, borderColor: color, color: "white"}}
        onClick={() => createExcel()}>
            <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
            EXCEL DE DEPENDENCIAS
        </button>
    )
}