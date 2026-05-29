"use client"
import excelParserEscuela from "@/utils/excelParserEscuela";
import { excelLineas, IDesglose, IDesgloseComparision } from "@/utils/interfaces";
import { hr_style, text_2_t_style } from "@/utils/styles";
import { useState } from "react";


export default function ImportacionColegios ({desglose}:{desglose:IDesglose[]}) {

    const [notFoundDesgloses,setNotFoundDesgloses] = useState<excelLineas[]>([])
    const [notMatchDesgloses,setNotMatchDesgloses] = useState<IDesglose[]>([])
    const [comparasionDesgloses,setComparasionDesgloses] = useState<IDesgloseComparision[]>([])

    const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(file) {
            const parsed = await excelParserEscuela(file)
            const notFound: excelLineas[] = []
            //const notMatch: IDesglose[] = []
            const comparasion: IDesgloseComparision[] = []
            parsed.forEach(p => {
                const desgloseFind = desglose.find(d => d.des.toUpperCase() === p.des.toUpperCase() && d.fortificado === p.fortificado)
                if(desgloseFind) {
                    comparasion.push({
                        line: p.line_num,
                        desglose_id: desgloseFind.desglose_id,
                        des1: desgloseFind.des,
                        rac1: desgloseFind.raciones,
                        fort1: desgloseFind.fortificado,
                        des2: p.des,
                        rac2: p.rac,
                        fort2: p.fortificado
                    })
                }
                else notFound.push(p)
            })
            console.log(notFound)
            console.log(comparasion)
        }
    }

    return (
        <div style={{marginBottom: 150}}>
            <h2 style={text_2_t_style}>IMPORTAR EXCEL</h2>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <input type="file" accept=".xlsx, .xls" onChange={e => handleExcel(e)}/>
            </div>
        </div>
    )
}