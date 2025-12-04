import * as XLSX from 'xlsx';

export default function <T extends object>(obj: T[] | null | undefined,page:string,title:string) {
    if(!obj) return 0
    const worksheet = XLSX.utils.json_to_sheet(obj)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook,worksheet,"page")
    XLSX.writeFile(workbook,title+'.xlsx')
}