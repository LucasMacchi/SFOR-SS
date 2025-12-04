import refillEmptySpace from "./refillEmptySpace";

export default function (pv:number,num:number):string {
    return refillEmptySpace(5,pv)+"-"+refillEmptySpace(8,num)
}