import dateObjetReturn from "./dateObjetReturn"


export default function (desglose: number) {

    const fecha = dateObjetReturn()
    return fecha.hour+fecha.day+desglose+fecha.month+fecha.year
}



