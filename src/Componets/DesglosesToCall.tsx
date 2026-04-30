"use client"
import { IAddLlamada, IAddPregunta, IDesgloseLlamada, ILlamada, IPregunta } from "@/utils/interfaces";
import { btn_s_style, text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";


const preguntasT:IAddPregunta[] = [
        {llamada_id: 0, pregunta: "¿Recibieron productos alimenticios de la empresa de lo que va del año?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Tuvieron algún inconveniente con los productos?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Están dentro de fecha de vencimiento?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Los envases están en buen estado?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Los productos están elevados del suelo?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿El lugar está limpio y ordenado?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Detectaron presencia de plagas?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Están protegidos de calor o humedad?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Utiliza metodo PEPS para ordenar su deposito?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Sabe diferenciar LOTE y fecha de VTO?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Están siguiendo las indicaciones de preparación?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Cocina en el establecimiento?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿De cuentos litros es la olla que utliza?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Cómo es el nivel de stock actual? (ALTO / MEDIO / BAJO)", respuesta: "ALTO",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Recibieron indicaciones sobre conservación?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Necesitan pallets para su deposito?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Necesita recetas o formas correcta de preparación?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "¿Necesitan apoyo o aclarar algo?", respuesta: "",fecha:"NOW()",reporte:false},
        {llamada_id: 0, pregunta: "Comentarios", respuesta: "",fecha:"NOW()",reporte:false}
]

export default function DesglosesToCall ({desgloses,editContFn,addLlamadaFn,departamentos,getLlamadasEscuelaFn,getRespuestasFn,resolverLlamadaFn}:
    {desgloses: IDesgloseLlamada[], editContFn: (columna: string, data: string, id: number) => Promise<boolean>,
        addLlamadaFn: (data: IAddLlamada,preguntas: IAddPregunta[]) => Promise<boolean>,departamentos:string[],
        getLlamadasEscuelaFn: (id: number) => Promise<ILlamada[]>,getRespuestasFn: (id: number) => Promise<IPregunta[]>,resolverLlamadaFn: (llamada_id: number,solucion:string) => Promise<boolean>
    }) {
    
    const [selectedDesglose, setSelectedDesglose] = useState<IDesgloseLlamada | null>(null)
    const [prioridad, setPrioridad] = useState(0)
    const [llamadas, setLlamadas] = useState<ILlamada[]>([])
    const [filteredColegios, setFilteredColegios] = useState<IDesgloseLlamada[]>(desgloses)
    const [selectedDep, setSelectedDep] = useState("")
    const [searchC, setSearchC] = useState("")
    const [timer,setTimer] = useState(false)
    const [soluciondes,setSolucionDes] = useState("")
    const [seconds,setSeconds] = useState(0)
    const [respuestas, setRespuestas] = useState<IPregunta[]>([])
    const [selectedLlamada, setSelectedLlamada] = useState(0)
    const [preguntas, setPreguntas] = useState<IAddPregunta[]>(preguntasT)

    useEffect(() => {
        let arr = desgloses
        if(selectedDep.length > 0) {
            arr = arr.filter(l => l.departamento === selectedDep)
        }
        if(searchC.length > 2) {
            arr = arr.filter(l => l.des.toLowerCase().includes(searchC.toLowerCase()))
        }
        setFilteredColegios(arr)

    },[selectedDep,searchC])

    useEffect(() => {
        if(timer){
            const interval = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
            
        }
    },[timer])

    useEffect(() => {
        setPreguntas(preguntasT)
        setTimer(false)
        setSeconds(0)
        setLlamadas([])
        setSelectedLlamada(0)
    },[selectedDesglose])

    
    const historialLlamadas = async () => {
        if(selectedDesglose) {
            const res = await getLlamadasEscuelaFn(selectedDesglose.desglose_id)
            const respuestas = await getRespuestasFn(selectedDesglose.desglose_id)
            console.log(res)
            console.log(respuestas)
            setLlamadas(res)
            setRespuestas(respuestas)
        }
    }

    const editContacto = async (columna: string) => {
        const newVal = prompt("Ingrese el nuevo valor:")
        if(!newVal) {
            alert("Valor no válido.")
            return
        }
        const res = await editContFn(columna, newVal, selectedDesglose?.desglose_id || 0)
        if(res) {
            alert("Contacto editado correctamente.")
            setSelectedDesglose(null)
            if(selectedDesglose) {
                const updatedDesglose = {...selectedDesglose, [columna]: newVal}
                setSelectedDesglose(updatedDesglose)
            }
        }
        else alert("Error al editar el contacto.")
    }

    const createLlamada = async () => {
        setTimer(false)
        console.log(seconds)
        if(confirm("¿Confirma que desea crear la llamada?") && seconds > 0) {
            if(selectedDesglose) {
                const data: IAddLlamada = {
                    fecha: 'NOW()',
                    desglose_id: selectedDesglose.desglose_id,
                    tiempo: seconds,
                    prioridad: prioridad
                }
                const res = await addLlamadaFn(data, preguntas)
                if(res) {                
                    alert("Llamada creada correctamente.")
                    setSelectedDesglose(null)
                    setPrioridad(0)
                    setTimer(false)
                    setSeconds(0)
                    setLlamadas([])
                    setSelectedLlamada(0)
                    window.location.reload()
                }
                else alert("Error al crear la llamada.")
            }
        }
        else alert("Error al crear llamada, debe tener segundos de llamada.")
    }

    const resolverLlamada = async (llamada_id: number) => {
        if(soluciondes.length > 10 && confirm("¿Quieres confirmar la solucion?")) {
            const res = await resolverLlamadaFn(llamada_id,soluciondes)
            if(res) {
                alert("Llamada resuelta correctamente.")
                window.location.reload()
            }
            else {
                alert("Error al resolver la llamada.")
                
            }
        } else alert("Solucion ingresada muy corta, minimo 10 caracteres")

    }


    const displaySeverity = (p:number | null) => {
        if(p === null || p === 0) return "white"
        if(p === 1) return "yellow"
        return "red"
    }

    const returnLlamada = ():ILlamada => {
        const ll:ILlamada = {
            llamada_id: 0,
            desglose_id: 0,
            fecha: new Date,
            tiempo:0,
            prioridad: 0,
        }
        if(selectedLlamada) {
            const llamada = llamadas.find(l => l.llamada_id === selectedLlamada)
            return llamada ? llamada : ll
        }
        else return ll
    }

    const addReporteRetiro = () => {
        const p:IAddPregunta = {llamada_id: 0, pregunta: "Retiro:", respuesta: "",fecha:"NOW()",reporte:true,respuesta_2:""}
        setPreguntas(preg => [...preg,p])
    }

    const respuestaReturner = (p:IAddPregunta,i:number) => {
        if(p.pregunta === "¿Cómo es el nivel de stock actual? (ALTO / MEDIO / BAJO)") {
            return (
                <tr key={i}>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left",width:500}}>{p.pregunta}</th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}></th>
                    <th style={{border: "1px solid", fontSize: 12}}>
                        <select name="estados_sel" id="state_sl"
                            onChange={(e) => setPreguntas(prev => {
                                const newPreguntas = [...prev]
                                newPreguntas[i].respuesta = e.target.value
                                return newPreguntas
                            })}>
                            <option value={"ALTO"}>ALTO</option>
                            <option value={"MEDIO"}>MEDIO</option>
                            <option value={"BAJO"}>BAJO</option>
                        </select>
                    </th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>
                        <input type="text" style={{width: "95%"}} value={p.respuesta} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta = e.target.value
                            return newPreguntas
                        })}/>
                    </th>
                </tr>
            )
        }
        else if(p.reporte) {
            return(
                <tr key={i}>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left",width:500}}>{p.pregunta}</th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>
                        Cantidad
                        <input type="number" style={{width: 50,textAlign:"center",marginLeft:5}} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta_2 = e.target.value
                            return newPreguntas
                        })}/>
                    </th>
                    <th style={{border: "1px solid", fontSize: 12}}>
                        <select name="estados_sel" id="state_sl"
                            onChange={(e) => setPreguntas(prev => {
                                const newPreguntas = [...prev]
                                newPreguntas[i].respuesta = e.target.value
                                return newPreguntas
                            })}>
                            <option value={""}>---</option>
                            <option value={"GALLETITAS"}>GALLETITAS</option>
                            <option value={"BUDINES"}>BUDINES</option>
                            <option value={"LECHE"}>LECHE</option>
                        </select>
                    </th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>
                        <input type="text" style={{width: "95%"}} value={p.respuesta +" - "+p.respuesta_2} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta = e.target.value
                            return newPreguntas
                        })}/>
                    </th>
                </tr>  
            )
        }
        else if(p.pregunta === "Comentarios") {
            return (
                <tr key={i}>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left",width:500}}>{p.pregunta}</th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}></th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}></th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>
                        <input type="text" style={{width: "95%"}} value={p.respuesta} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta = e.target.value
                            return newPreguntas
                        })}/>
                    </th>
                </tr>
            )
        }
        else {
            return (
                <tr key={i}>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left",width:500}}>{p.pregunta}</th>
                    <th style={{border: "1px solid", fontSize: 12}}>
                        <input type="checkbox" checked={p.respuesta === "SI"} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta = e.target.checked ? "SI" : ""
                            return newPreguntas
                        })}/>
                    </th>
                    <th style={{border: "1px solid", fontSize: 12}}>
                        <input type="checkbox" checked={p.respuesta === "NO"} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta = e.target.checked ? "NO" : ""
                            return newPreguntas
                        })}/>
                    </th>
                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>
                        <input type="text" style={{width: "95%"}} value={p.respuesta} onChange={(e) => setPreguntas(prev => {
                            const newPreguntas = [...prev]
                            newPreguntas[i].respuesta = e.target.value
                            return newPreguntas
                        })}/>
                    </th>
                </tr>
            )
        }
    }
    

    return(
        <div style={{marginBottom: 200}}>
            <div style={{display:"flex",margin:20}}>
                <div >
                    <h2 style={text_2_t_style}>DESGLOSES PARA LLAMAR</h2>
                    <div style={{display:"flex",margin:20}}>
                        <div>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>BUSCAR</h2>
                                <input name="plan-inpt" value={searchC} style={{width: 250,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setSearchC(e.target.value)}/>
                            </div>
                        </div>
                        <div style={{marginLeft: 10}}>
                            <h2 style={{...text_2_t_style, marginTop: 40}}>DEPARTAMENTO</h2>
                            <select name="estados_sel" id="state_sl"
                            onChange={(e) => setSelectedDep(e.target.value)}
                            style={{width: 300,fontSize:16,marginBottom: 20}}>
                                <option value={""}>---</option>
                                {departamentos.map((d,i) => (
                                    <option key={i} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{maxHeight: 650,height:650,width: "85%", overflow: "scroll"}}>
                        {filteredColegios.length > 0 ? 
                        <table style={{width: "100%"}}>
                            <tbody>
                                <tr>
                                    <th style={{border: "1px solid", fontSize: 20}}>CUE</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>ESCUELA</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>ULTIMA LLAMADA</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>DEPARTAMENTO</th>
                                </tr>
                                {filteredColegios.map((d,i) => (
                                <tr key={i} style={{backgroundColor: selectedDesglose?.desglose_id === d.desglose_id ? "Highlight" : displaySeverity(d.prioridad ? d.prioridad : null)}}
                                onClick={() => setSelectedDesglose(d)}>
                                    <th style={{border: "1px solid", fontSize: 20}}>{d.cue}</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>{d.des}</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>{d.ultima_llamada?.toISOString().split('T')[0] || "N/A"}</th>
                                    <th style={{border: "1px solid", fontSize: 20}}>{d.departamento}</th>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        :
                        <h2 style={text_2_t_style}>ESCUELAS NO CARGADAS</h2>
                        }
                    </div>
                </div>
                <div>
                    <div>
                        <h2 style={text_2_t_style}>DESGLOSES PARA LLAMAR URGENTE</h2>
                        <div style={{maxHeight: 250,height:250,width: "100%", overflow: "scroll"}}>
                            {filteredColegios.length > 0 ? 
                            <table style={{width: "100%"}}>
                                <tbody>
                                    <tr>
                                        <th style={{border: "1px solid", fontSize: 20}}>CUE</th>
                                        <th style={{border: "1px solid", fontSize: 20}}>ESCUELA</th>
                                        <th style={{border: "1px solid", fontSize: 20}}>ULTIMA LLAMADA</th>
                                    </tr>
                                    {filteredColegios.map((d,i) => {
                                        if(d.prioridad && d.prioridad === 2) {
                                            return (
                                                <tr key={i} style={{backgroundColor: displaySeverity(d.prioridad ? d.prioridad : null)}}
                                                onClick={() => setSelectedDesglose(d)}>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.cue}</th>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.des}</th>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.ultima_llamada?.toISOString().split('T')[0] || "N/A"}</th>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                            :
                            <h2 style={text_2_t_style}>ESCUELAS NO CARGADAS</h2>
                            }
                        </div>
                    </div>
                    <div>
                        <h2 style={text_2_t_style}>DESGLOSES PARA LLAMAR CON PRIORIDAD</h2>
                        <div style={{maxHeight: 250,height:250,width: "100%", overflow: "scroll"}}>
                            {filteredColegios.length > 0 ? 
                            <table style={{width: "100%"}}>
                                <tbody>
                                    <tr>
                                        <th style={{border: "1px solid", fontSize: 20}}>CUE</th>
                                        <th style={{border: "1px solid", fontSize: 20}}>ESCUELA</th>
                                        <th style={{border: "1px solid", fontSize: 20}}>ULTIMA LLAMADA</th>
                                    </tr>
                                    {filteredColegios.map((d,i) => {
                                        if(d.prioridad && (d.prioridad === 1)) {
                                            return (
                                                <tr key={i} style={{backgroundColor: displaySeverity(d.prioridad ? d.prioridad : null)}}
                                                onClick={() => setSelectedDesglose(d)}>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.cue}</th>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.des}</th>
                                                    <th style={{border: "1px solid", fontSize: 20}}>{d.ultima_llamada?.toISOString().split('T')[0] || "N/A"}</th>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                            :
                            <h2 style={text_2_t_style}>ESCUELAS NO CARGADAS</h2>
                            }
                        </div>
                    </div>
                </div>      
            </div>
            <h2 style={text_2_t_style}>LLAMADA</h2>
            <hr color="#4A6EE8" style={{marginBottom: 20}}/>
            <div style={{margin: 20}}>
                <div>
                    <div style={{display:"flex"}}>
                        {selectedDesglose ? (
                            <div>
                                <h3 style={{...text_2_t_style,marginTop:20}}>ESCUELA: {selectedDesglose.des}</h3>
                                <h3 style={{...text_2_t_style,marginTop:20}}>CUE: {selectedDesglose.cue}</h3>
                                <h3 style={{...text_2_t_style,marginTop:20}}>ULTIMA LLAMADA: {selectedDesglose.ultima_llamada?.toISOString().split('T')[0] || "N/A"}</h3>
                                <div style={{marginTop: 20,display:"flex"}}>
                                    <h3 style={text_2_t_style}>CARGO: {selectedDesglose.cargo || "N/A"}</h3>
                                    <button style={{...btn_s_style,marginLeft:5}} onClick={() => editContacto("cargo")}>EDITAR</button>
                                </div>
                                <div style={{marginTop: 20,display:"flex"}}>
                                    <h3 style={text_2_t_style}>CORREO: {selectedDesglose.correo || "N/A"}</h3>
                                    <button style={{...btn_s_style,marginLeft:5}} onClick={() => editContacto("correo")}>EDITAR</button>
                                </div>
                                <div style={{marginTop: 20,display:"flex"}}>
                                    <h3 style={text_2_t_style}>TELEFONO 1: {selectedDesglose.telefono1 || "N/A"}</h3>
                                    <button style={{...btn_s_style,marginLeft:5}} onClick={() => editContacto("telefono1")}>EDITAR</button>
                                </div>
                                <div style={{marginTop: 20,display:"flex"}}>
                                    <h3 style={text_2_t_style}>TELEFONO 2: {selectedDesglose.telefono2 || "N/A"}</h3>
                                    <button style={{...btn_s_style,marginLeft:5}} onClick={() => editContacto("telefono2")}>EDITAR</button>
                                </div>
                                <div style={{marginTop: 20,display:"flex"}}>
                                    <h3 style={text_2_t_style}>TELEFONO 3: {selectedDesglose.telefono3 || "N/A"}</h3>
                                    <button style={{...btn_s_style,marginLeft:5}} onClick={() => editContacto("telefono3")}>EDITAR</button>
                                </div>
                            </div>
                        ) : (
                            <h3 style={text_2_t_style}>Seleccione un desglose para ver los detalles de la escuela.</h3>
                        )}
                    </div>

                </div>
                {(selectedDesglose && !timer) && (
                    <button style={{...btn_s_style,marginLeft:5,marginTop: 10}} onClick={() => setTimer(true)}>INICIAR CRONÓMETRO</button>
                )}
                {timer && (
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SEGUNDOS TRANSCURRIDOS: {seconds} s</h2>
                )}
                <div style={{marginTop:20}}>
                    {selectedDesglose && (
                        <div style={{display:"flex"}}>
                            <div>
                                <table style={{width: "85%"}}>
                                    <tbody>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 20}}>PREGUNTA</th>
                                            <th style={{border: "1px solid", fontSize: 20}}>SI</th>
                                            <th style={{border: "1px solid", fontSize: 20}}>NO</th>
                                            <th style={{border: "1px solid", fontSize: 20}}>COMENTARIO</th>
                                        </tr>
                                        {preguntas.map((p,i) => (
                                            respuestaReturner(p,i)
                                        ))}
                                    </tbody>
                                </table>
                                <div>
                                    <button style={{...btn_s_style,marginLeft:5,marginTop: 10}} onClick={() => addReporteRetiro()}>AGREGAR RETIRO</button>
                                </div>
                                {selectedDesglose && (
                                <div style={{marginTop:20}}>
                                    <div style={{marginLeft: 10}}>
                                        <h2 style={{...text_2_t_style, marginTop: 40}}>PRIORIDAD</h2>
                                        <select name="estados_sel" id="state_sl"
                                        onChange={(e) => setPrioridad(parseInt(e.target.value))}
                                        style={{width: 300,fontSize:16,marginBottom: 20}}>
                                            <option value={0}>SIN PRIORIDAD</option>
                                            <option value={1}>MEDIA PRIORIDAD</option>
                                            <option value={2}>ALTA PRIORIDAD</option>
                                        </select>
                                    </div>
                                </div>
                                )}
                                <button style={{...btn_s_style,marginLeft:5,marginTop: 10}} onClick={() => createLlamada()}>CONFIRMAR LLAMADA</button>
                            </div>
                            <div style={{width: "40%"}}>
                                <table style={{width: "100%"}}>
                                    <tbody>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 20}}>PREGUNTAS QUE PUEDEN SURGIR</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>¿Cuando es el proximo PLAN o entrega?</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Eso debe preguntar al ministerio, ellos podran brindarle una respuesta mas certera. El señor Roberto Gerometta encargado de comedores escolares.</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Tengo comida en mal estado ¿Que hago?</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Cuantas cajas tiene y de que alimento (pedir ubicacion, escuela)</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>No se como preparar los alimentos correctamento o cuando preparo a los chicos no les gusta.</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Enviar material digital, formas correctas de preparacion y dilucion.</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>A los chicos no le gusta XXX alimento</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Tomar nota de que alimento, preguntar porque no gusta (color, cabor, aroma, textura)</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Me llego menos mercaderia, ¿que hago?</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Preguntar si dejo escrito en el acta de disconformidad.</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Cambiar cabecera</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Solicitar datos de la dependencia (nombre de escuela, preguntar cual es su cabecera actual y a cual quiere cambiar) se evaluara si es posible</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Altas y bajas de raciones / Alta de dietas especiales</th>
                                        </tr>
                                        <tr>
                                            <th style={{border: "1px solid", fontSize: 14}}>Se encarga el ministerio.</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    )}
                </div>
                {selectedDesglose && (
                    <div style={{marginTop:50}}>
                        <h2 style={text_2_t_style}>HISTORIAL</h2>
                        <hr color="#4A6EE8" style={{marginBottom: 20}}/>
                        <button style={{...btn_s_style,marginLeft:5,marginTop: 10}} onClick={() => historialLlamadas()}>HISTORIAL</button>
                    </div>
                )}
                {llamadas.length > 0 ? (
                    <div style={{marginTop: 20}}>
                        <h3 style={text_2_t_style}>HISTORIAL DE LLAMADAS</h3>
                        <select name="estados_sel" id="state_sl"
                        onChange={(e) => setSelectedLlamada(parseInt(e.target.value))}
                        style={{width: 300,fontSize:16,marginBottom: 20}}>
                            <option value={""}>---</option>
                            {llamadas.map((d,i) => {
                                if(d.solucion && d.fecha_solucion){
                                    return(<option key={i} value={d.llamada_id}>{d.fecha.toISOString().split('T')[0]+" - S "+d.fecha_solucion.toISOString().split('T')[0]+" - "+d.tiempo+" seg."}</option>)
                                }
                                else {
                                    return(<option key={i} value={d.llamada_id}>{d.fecha.toISOString().split('T')[0]+" - "+d.tiempo+" seg."}</option>)
                                }
                            })}
                        </select>
                    </div>
                ) : null}
                {(respuestas.length > 0 && selectedLlamada) ? (
                    <div style={{marginTop: 20, marginLeft: 120}}>
                        <h3 style={text_2_t_style}>RESPUESTAS DE LA ULTIMA LLAMADA</h3>
                        <div style={{maxHeight: 450,height:450,width: "85%", overflow: "scroll"}}>
                            <table style={{width: "100%"}}>
                                <tbody>
                                    {respuestas.map((r,i) => {
                                        if(r.llamada_id === selectedLlamada) {
                                            return (
                                                <tr key={i}>
                                                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>{r.pregunta}</th>
                                                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>{r.respuesta}</th>
                                                    <th style={{border: "1px solid", fontSize: 12,textAlign:"left"}}>{r.respuesta_2 ? r.respuesta_2 : "N/A"}</th>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                            <div style={{marginTop:35}}>
                                <h3 style={text_2_t_style}>SOLUCION</h3>
                                <textarea style={{height: 100,width: "40%",resize: "none"}} value={returnLlamada().solucion ? returnLlamada().solucion : soluciondes}
                                disabled={returnLlamada().solucion ? true : false}
                                onChange={(e) => setSolucionDes(e.target.value)}/>
                                {returnLlamada().solucion ?
                                    <div>
                                        <h3 style={text_2_t_style}>LLAMADA SOLUCIONADA</h3>
                                    </div>
                                :
                                    <div>
                                        <button style={{...btn_s_style,marginLeft:5,marginTop:10}} onClick={() => resolverLlamada(selectedLlamada)}>SOLUCIONADO</button>
                                    </div>
                                }

                            </div>
                        </div>
                ) : null}
            </div>
        </div>

    )
}
