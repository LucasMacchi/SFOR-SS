export default function (val: number) {
    return Intl.NumberFormat("es-AR",{style: "decimal"}).format(val)
}