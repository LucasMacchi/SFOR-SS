"use client"
import { btn_s_style, text_2_s_style } from "@/utils/styles";
import PlanSelector from "./PlanSelector";
import LinkMenu from "./LinkMenu";
import { CSSProperties, useState } from "react";
import { IReparto } from "@/utils/interfaces";
import LogoutBtn from "./LogoutBtn";



export default function MenuLateral({rol,username,planActual,userplan,createRepartoFn,logoutFn}:
    {rol:number,username:string,planActual:IReparto[],userplan:number,createRepartoFn:(plan:number,year:number) => Promise<boolean>,logoutFn:() => Promise<boolean>}) {

    const [open, setOpen] = useState(false)
    const linkListStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column"
    }

    return(
          <div style={{backgroundColor: "#4A6EE8", position: "fixed"}}>
            <div>
                <button style={{...btn_s_style,width:200}} onClick={() => setOpen(!open)}>☰ Menu</button>
            </div>
            <div style={{paddingLeft:10 ,marginRight: 25, width: 250, height: "100vh",display: open ? "block" : "none"}}>
                <div style={{marginBottom: 10}}>
                    <h4 style={text_2_s_style}>USER: {username}</h4>
                    <PlanSelector planes={planActual} userPlan={userplan} rol={rol} createRepartoFn={createRepartoFn}/>
                </div>
                <div style={linkListStyle}>
                    <LinkMenu where="/inicio" titulo="inicio" />
                    {rol <= 2 && <LinkMenu where="/inicio/planificacion" titulo="planificacion" />}
                    {rol <= 2 && <LinkMenu where="/inicio/generar" titulo="generar" />}
                    {rol <= 2 && <LinkMenu where="/inicio/generarViaje" titulo="generar viaje" />}
                    {(rol === 3 || rol === 2 || rol === 1 ) && <LinkMenu where="/inicio/traer" titulo="consultar" />}
                    {rol <= 2 && <LinkMenu where="/inicio/planes" titulo="planes" />}
                    {rol <= 2 && <LinkMenu where="/inicio/insumos" titulo="insumos"/>}
                    {rol <= 2 && <LinkMenu where="/inicio/escuelas" titulo="escuelas" />}             
                    {(rol === 3 || rol === 2 || rol === 1 ) && <LinkMenu where="/inicio/stock" titulo="stock"/>}
                    {rol <= 2 && <LinkMenu where="/inicio/informes" titulo="informes" />}
                    {(rol === 4 || rol === 2 || rol === 1 )&& <LinkMenu where="/inicio/callcenter" titulo="call center" />}
                    {(rol === 4 || rol === 2 || rol === 1 )&& <LinkMenu where="/inicio/visita" titulo="visita" />}
                    {<LinkMenu where="/inicio/ticket" titulo="ticket" />}
                    {rol <= 2 && <LinkMenu where="/inicio/facturacion" titulo="facturacion" />}
                    {rol <= 2 && <LinkMenu where="/inicio/datos" titulo="datos" />}
                    {rol <= 1 && <LinkMenu where="/inicio/usuarios" titulo="usuarios" />}
                </div>
                <div >
                    <LogoutBtn logoutFn={logoutFn}/>
                </div>
            </div>

          </div>
    )
}