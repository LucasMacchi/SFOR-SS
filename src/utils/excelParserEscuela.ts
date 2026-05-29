import { excelLineas } from "./interfaces";
import * as XLSX from 'xlsx';

async function parsedReturned (excel: File): Promise<excelLineas[]> {
    return new Promise((resolve, reject) =>{
        const reader = new FileReader()
        let data: excelLineas[] = []
        reader.onerror = () => reject("Error")
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const binaryStr = event.target?.result;
            const workbook = XLSX.read(binaryStr, { type: 'array' });
            const sheets = workbook.SheetNames
            data = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]])
            /*
            sheets.forEach(sheet => {
                const currentSh = workbook.Sheets[sheet]
                const excelP: excelLineas[] = XLSX.utils.sheet_to_json(currentSh)
                data.push(excelP)
            });
            */
            resolve(data)
        };
        reader.readAsArrayBuffer(excel)
    })

}

export default async function (excel: File,): Promise<excelLineas[]> {
    const parsed = await parsedReturned(excel)
    parsed.forEach((line,index) => {
        line.line_num = index + 1
        line.fortificado = Boolean(line.fortificado)
    })
    console.log(parsed)
    return parsed
}