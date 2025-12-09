"use client"
import { IAddPlan, IAddPlanDetails, IInsumo, IPlan, IPlanDetails } from "@/utils/interfaces";
import { btn_s_style, hr_style, text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";
//@ts-ignore
import "./css/hoverTableCell.css"

export default function PlanesDisplay ({planes,insumos,editDaysFn,addPlanFn,addDetailFn,deleteDetailFn}:{planes: IPlan[],insumos:IInsumo[],
    editDaysFn: (detail_id:number,days:number) => Promise<boolean>,
    addPlanFn: (plan: IAddPlan,details:IAddPlanDetails[]) => Promise<boolean>,
    addDetailFn: (detail:IAddPlanDetails) => Promise<boolean>,
    deleteDetailFn: (detail_id: number) => Promise<boolean>}) {

    const [selectedP, setSelectedP] = useState(-1)
    const [plan, setPlan] = useState<IPlan>()
    const [up,setUpd] = useState(0)
    const [addPlan, setAddPlan] = useState<IAddPlan>({days:0,descripcion:"",fortificado: false})
    const [arrayInsumos, setArrayInsumos] = useState<IAddPlanDetails[]>([])
    useEffect(() => {
        if(selectedP > -1) {
            setPlan(planes[selectedP])
        }
    },[selectedP])

    const changeDays = async (detail_id:number) => {
        const days = prompt("Ingrese la cantidad de dias:")
        if(days && parseInt(days) && detail_id && confirm("¿Quieres modificar la cantidad de dias?")) {
            const res = await editDaysFn(detail_id,parseInt(days))
            if(res) {
                alert("Dias cambiados.")
                plan?.detalles.forEach(d => {
                    if(d.detail_id === detail_id) {
                        d.dias = parseInt(days)
                    }
                });
                setPlan(plan)
                setUpd(up+1)
            }
            else alert("Error al cambiar la cantidad de dias")
        }
    }

    const changeDaysDetail = async (index:number) => {
        const days = prompt("Ingrese la cantidad de dias:")
        if(days && parseInt(days) && arrayInsumos[index] && confirm("¿Quieres modificar la cantidad de dias?")) {
            arrayInsumos[index].dias = parseInt(days)
            setUpd(up+1)
        }
    }

    const deleteDetail = async (id:number,des: string) => {
        if(confirm("¿Quieres eliminar el insumo "+des+" del plan?")) {
            const res = await deleteDetailFn(id)
            if(res) {
                alert("Detalle eliminado al plan.")
                window.location.reload()
            }
            else alert("Error al eliminar el detalle del plan.")
        }
    }

    const addInsumoToPlan = (index: number) => {
        if(index > -1) {
            const daysIns = prompt("Dias a asignar al insumo en el plan: ")
            if(daysIns && parseInt(daysIns)) {
                const dayParsed = parseInt(daysIns)
                const insumo = insumos[index]
                const detail: IAddPlanDetails = {
                    ins_id: insumo.ins_id,
                    dias: dayParsed,
                    des: insumo.des
                }
                setArrayInsumos([...arrayInsumos, detail])
            }
        }
    }

    const addInsumoToSelPlan = async (index:number) => {
        if(index > -1) {
            const daysIns = prompt("Dias a asignar al insumo en el plan: ")
            if(daysIns && parseInt(daysIns) && plan && confirm("¿Quieres agregar el insumo al plan "+plan.des+"?")) {
                const dayParsed = parseInt(daysIns)
                const insumo = insumos[index]
                const detail: IAddPlanDetails = {
                    ins_id: insumo.ins_id,
                    dias: dayParsed,
                    des: insumo.des,
                    plan_id: plan.plan_id
                }
                const res = await addDetailFn(detail)
                if(res) {
                    alert("Detalle agregado al plan.")
                    window.location.reload()
                }
                else alert("Error al crear el nuevo plan.")

            }else alert("Faltan datos.")
        }
    }

    const delRt = (index:number) => {
        const arr = arrayInsumos
        arr.splice(index,1)
        setArrayInsumos(arr)
        setUpd(up+1)
    }

    const createPlan = async () => {
        if(addPlan.days && addPlan.descripcion.length > 0 && arrayInsumos.length > 0 && 
            confirm("¿Quieres crear el nuevo plan "+addPlan.descripcion+" por "+addPlan.days+" dias?")) {
            const res = await addPlanFn(addPlan,arrayInsumos)
            if(res) {
                alert("Plan nuevo agregado "+addPlan.descripcion)
                window.location.reload()
            }
            else alert("Error al crear el nuevo plan.")
        }
        else alert("Faltan datos.")
    }

    return (
        <div style={{marginLeft: 10}}>
            <div style={{display: "flex"}}>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL PLAN</h2>
                    <select name="estados_sel" id="state_sl" value={selectedP}
                    onChange={(e) => setSelectedP(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {planes.map((p,i) => (
                            <option key={i} value={i}>{p.des+" - "+p.dias+" DIAS"}</option>
                        ))}
                    </select>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>AGREGAR INSUMO AL PLAN</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => addInsumoToSelPlan(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {insumos.map((ins,i) => (
                            <option key={ins.ins_id} value={i}>{ins.des}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div >
                <table style={{width: "70%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "5%"}}>INSUMO</th>
                            <th style={{border: "1px solid", width: "5%"}}>DIAS</th>
                        </tr>
                        {plan?.detalles.map((d) => (
                        <tr key={d.detail_id}>
                            <th onClick={() => deleteDetail(d.detail_id,d.des)} id="del" style={{border: "1px solid", width: "5%"}}>{d.des}</th>
                            <th onClick={() => changeDays(d.detail_id)} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.dias}</th>
                        </tr>   
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{marginBottom: 180}}>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>CREAR NUEVO PLAN</h2>
                    <hr color="#4A6EE8" style={hr_style}/>
                </div>
                <div style={{display: "flex"}}>
                    <div>
                        <h4 style={{...text_2_t_style, marginTop: 40}}>DESCRIPCION</h4>
                        <input name="plan-inpt" value={addPlan.descripcion} style={{width: 400,fontSize:24,marginBottom: 20}}
                        onChange={(e) => setAddPlan({...addPlan, descripcion: e.target.value})}/>
                    </div>
                    <div style={{marginLeft: 30}}>
                        <h4 style={{...text_2_t_style, marginTop: 40}}>DIAS DE COBERTURA</h4>
                        <input type="number" name="plan-inpt" value={addPlan.days} 
                        style={{width: 120,fontSize:24,marginBottom: 20}}
                        onChange={(e) => setAddPlan({...addPlan, days: parseInt(e.target.value)})}/>
                    </div>
                    <div style={{marginLeft: 30}}>
                        <h4 style={{...text_2_t_style, marginTop: 40}}>TIPO</h4>
                        <select name="estados_sel" id="state_sl" value={addPlan.fortificado ? 2 : 1}
                        onChange={(e) => setAddPlan({...addPlan, fortificado: parseInt(e.target.value) === 1 ? false : true})}
                        style={{width: 300,fontSize:24,marginBottom: 20}}>
                            <option value={1}>COPA DE LECHE</option>
                            <option value={2}>ALMUERZO</option>
                        </select>
                    </div>
                </div>
                <div style={{alignContent: "baseline"}}>
                    <button style={btn_s_style} onClick={() => createPlan()}>
                        CREAR NUEVO PLAN
                    </button>
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>AGREGAR INSUMOS</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => addInsumoToPlan(parseInt(e.target.value))}
                    style={{width: 500,fontSize:24,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {insumos.map((ins,i) => (
                            <option key={ins.ins_id} value={i}>{ins.des}</option>
                        ))}
                    </select>
                </div>
                <div>
                <table style={{width: "70%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "5%"}}>INSUMO</th>
                            <th style={{border: "1px solid", width: "5%"}}>DIAS</th>
                        </tr>
                        {arrayInsumos.map((d,i) => (
                        <tr key={i}>
                            <th onClick={() => delRt(i)} id="del" style={{border: "1px solid", width: "5%"}}>{d.des}</th>
                            <th onClick={() => changeDaysDetail(i)} id="cnt" style={{border: "1px solid", width: "5%"}}>{d.dias}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}