
//devuelve la fecha en el formato adecuado para la exportacion
export default function dateParser (tDate: Date): string {
    const day = tDate.getUTCDate()
    let dayStr = day.toString()
    const month = tDate.getUTCMonth() + 1
    let mStr = month.toString()
    const year = tDate.getUTCFullYear()
    const yStr = year.toString()
    if(day < 10) dayStr = "0"+dayStr
    if(month < 10) mStr = "0"+mStr
    return year+mStr+dayStr
}