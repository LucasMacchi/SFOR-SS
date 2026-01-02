//Devuelve el cuit con lineas
export default function cuitParserFn (cuit: number): string {
    const cuitStr = cuit.toString()
    let newCuit = ""
    for (let i = 0; i < cuitStr.length; i++) {
        newCuit += cuitStr[i]
        if(i === 1 || i === 9) newCuit +="-"
    }
    
    return newCuit
}