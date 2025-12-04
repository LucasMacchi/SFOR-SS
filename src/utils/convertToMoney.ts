export default function (val: number) {
    return Intl.NumberFormat("es-AR",{style: "currency", currency: "ARS"}).format(val)
}