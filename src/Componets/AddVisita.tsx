"use client"
import { IAddVisita, IDesgloseVisitar, IVisitaPreguntaAdd } from "@/utils/interfaces";
import { btn_s_style, text_2_t_style } from "@/utils/styles";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useEffect, useState } from "react";


export default function AddVisita({ desgloses, departamentos, addVisita }: { desgloses: IDesgloseVisitar[]; departamentos: string[]; addVisita: (v: IAddVisita, preguntas: IVisitaPreguntaAdd[]) => Promise<boolean> }) {

    const [preguntas, setPreguntas] = useState<IVisitaPreguntaAdd[]>([
        {pregunta: "2.Cocina en el establecimiento", respuesta:"",custom: false},
        {pregunta: "2.Reparte los alimentos", respuesta:"",custom: false},
        {pregunta: "3.Raciones diarias - Almuerzo", respuesta:"",custom: true},
        {pregunta: "3.Raciones diarias - Copa de leche", respuesta:"",custom: true},
        {pregunta: "4.Conocen qué es un remito", respuesta:"",custom: false},
        {pregunta: "4.Saben leerlo correctamente", respuesta:"",custom: false},
        {pregunta: "4.Tuvieron inconvenientes", respuesta:"",custom: false},
        {pregunta: "4.Controlan mercadería al recibir", respuesta:"",custom: false},
        {pregunta: "4.Registran la recepción", respuesta:"",custom: false},
        {pregunta: "4.Fecha última recepción", respuesta:"",custom: true},
        {pregunta: "5.Depósito exclusivo de alimentos", respuesta:"",custom: false},
        {pregunta: "5.Depósito adecuado", respuesta:"",custom: false},
        {pregunta: "5.Limpio y ordenado", respuesta:"",custom: false},
        {pregunta: "5.Sin plagas o restos de materia fecal*", respuesta:"",custom: false},
        {pregunta: "5.Uso de estanterías", respuesta:"",custom: false},
        {pregunta: "5.Separación del piso", respuesta:"",custom: false},
        {pregunta: "5.Separación de paredes", respuesta:"",custom: false},
        {pregunta: "5.Aplicación PEPS", respuesta:"",custom: false},
        {pregunta: "5.Control de vencimientos*", respuesta:"",custom: false},
        {pregunta: "5.Alimentos sobrantes", respuesta:"",custom: false},
        {pregunta: "5.Alimentos vencidos*", respuesta:"",custom: false},
        {pregunta: "6.Saben qué es lote", respuesta:"",custom: false},
        {pregunta: "6.Identifican lote", respuesta:"",custom: false},
        {pregunta: "6.Conocen veto de alimentos", respuesta:"",custom: false},
        {pregunta: "7.Estado adecuado", respuesta:"",custom: false},
        {pregunta: "7.Limpieza correcta", respuesta:"",custom: false},
        {pregunta: "7.Agua potable*", respuesta:"",custom: false},
        {pregunta: "7.Poseen todos los utensilios", respuesta:"",custom: false},
        {pregunta: "8.Preparación correcta", respuesta:"",custom: false},
        {pregunta: "8.Cocción completa", respuesta:"",custom: false},
        {pregunta: "8.Cocinan en el establecimiento", respuesta:"",custom: false},
        {pregunta: "8.Uso de recetas", respuesta:"",custom: false},
        {pregunta: "9.Aceptabilidad de los Niños", respuesta:"",custom: true},
        {pregunta: "10.Capacitación en remitos", respuesta:"",custom: false},
        {pregunta: "10.Capacitación en recepción", respuesta:"",custom: false},
        {pregunta: "10.Capacitación en depósito", respuesta:"",custom: false},
        {pregunta: "10.Capacitación sobre alimentación saludable", respuesta:"",custom: false},
        {pregunta: "10.Capacitación en cocina", respuesta:"",custom: false},
        {pregunta: "11.Sigue las indicaciones al preparar alimentos", respuesta:"",custom: false},
        {pregunta: "11.Respeta porciones sugeridas", respuesta:"",custom: false},
        {pregunta: "11.Prepara correctamente chocolatada con leche", respuesta:"",custom: false},
        {pregunta: "11.Utiliza correctamente otros alimentos en la preparación", respuesta:"",custom: false},

    ])
    const [selectedDep, setSelectedDep] = useState<string>("")
    
    const [fechaVisita, setFechaVisita] = useState<string>("")

    const [searchC, setSearchC] = useState<string>("")

    const [filteredColegios, setFilteredColegios] = useState<IDesgloseVisitar[]>(desgloses)

    const [selectedEscuela, setSelectedEscuela] = useState<number>(-1)

    const [imagenes, setImagenes] = useState<string[]>([])


    useEffect(() => {
        setSelectedEscuela(-1)
    },[selectedDep,searchC])

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


    const handleRegistrarVisita = async () => {
        if(selectedEscuela > -1 && filteredColegios[selectedEscuela] && fechaVisita.length > 0) {
            let check = true
            preguntas.forEach(p => {
                if(p.respuesta.length === 0) {
                    check = false
                }
            });
            if(check && imagenes.length > 0 && confirm("¿Confirma que desea registrar esta visita?")) {
                imagenes.forEach((img,i) => {
                    preguntas.push({pregunta: "IMAGEN "+(i+1), respuesta: img, custom: false})
                });
                const res = await addVisita({desglose_id: filteredColegios[selectedEscuela].desglose_id, fecha_visita: fechaVisita}, preguntas)
                if(res) {
                    alert("Visita registrada correctamente.")
                    window.location.reload()
                }
                else alert("Error al registrar la visita, intente nuevamente.")
            }
            else alert("Debe responder todas las preguntas y subir imágenes para registrar la visita.")
        }
        else alert("Debe seleccionar una escuela e ingresar la fecha de visita para registrar la visita.")
    }

    const handleImages = (r: CloudinaryUploadWidgetResults) => {
        //console.log(r)
        const url = r && r.info && typeof r.info !== "string" && r.info.secure_url.length > 0 ? r.info.secure_url : "";
        if(url) {
            setImagenes(prev => [...prev, url])

        }
    }

    return(
        <div style={{marginLeft: 20,marginBottom:120}}>
            <div>
                <h2 style={text_2_t_style}>AGREGAR UN NUEVO RECORRIDO</h2>
            </div>
            <div style={{ width: "55%", display:"flex", justifyContent:"space-evenly"}}>
                <div>
                    <h4 style={{...text_2_t_style}}>BUSCAR</h4>
                    <input name="plan-inpt" value={searchC} style={{width: 150}}
                    onChange={(e) => setSearchC(e.target.value)}/>
                </div>
                <div style={{marginBottom: 25}}>
                    <h4 style={{...text_2_t_style}}>DEPARTAMENTO</h4>
                    <select name="estados_sel" id="state_sl"
                        onChange={(e) => setSelectedDep(e.target.value)}>
                        <option value={""}>---</option>
                        {departamentos.map((dep, index) => (
                            <option key={index} value={dep}>
                                {dep}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                    <h4 style={{...text_2_t_style}}>ESCUELA*</h4>
                    <select name="estados_sel" id="state_sl"
                    style={{width: 450,marginBottom: 25}} value={selectedEscuela}
                        onChange={(e) => setSelectedEscuela(parseInt(e.target.value))}>
                        <option value={-1}>---</option>
                        {filteredColegios.map((esc, index) => (
                            <option key={index} value={index}>
                                {esc.des}
                            </option>
                        ))}
                    </select>
            </div>
            <div>
                <table style={{width: "55%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>PREGUNTA</th>
                            <th style={{border: "1px solid", fontSize: 20}}>RESPUESTA</th>
                        </tr>
                        {preguntas.map((pregunta,index) => (
                            !pregunta.custom ?
                            <tr key={index}>
                                <td style={{border: "1px solid", fontSize: 12}}>{pregunta.pregunta}</td>
                                <td style={{border: "1px solid", fontSize: 12, display:"flex", justifyContent:"center"}}> SI
                                <input type="checkbox" checked={pregunta.respuesta === "SI"} onChange={(e) => setPreguntas(prev => {
                                    const newPreguntas = [...prev]
                                    newPreguntas[index].respuesta = e.target.checked ? "SI" : ""
                                    return newPreguntas
                                })}/>
                                NO
                                <input type="checkbox" checked={pregunta.respuesta === "NO"} onChange={(e) => setPreguntas(prev => {
                                    const newPreguntas = [...prev]
                                    newPreguntas[index].respuesta = e.target.checked ? "NO" : ""
                                    return newPreguntas
                                })}/>
                                </td>
                            </tr>
                            : 
                            <tr key={index}>
                                <td style={{border: "1px solid", fontSize: 12}}>{pregunta.pregunta}</td>
                                <td style={{border: "1px solid", fontSize: 12}}>
                                    <input type="text" style={{textAlign:"center",width: "95%"}} value={pregunta.respuesta} onChange={(e) => setPreguntas(prev => {
                                        const newPreguntas = [...prev]
                                        newPreguntas[index].respuesta = e.target.value
                                        return newPreguntas
                                    })}/>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td style={{border: "1px solid", fontSize: 12}}>Fecha de visita</td>
                            <td style={{border: "1px solid", fontSize: 12}}>
                                <input type="date" style={{textAlign:"center",width: "95%"}} value={fechaVisita} onChange={(e) => setFechaVisita(e.target.value)}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <CldUploadButton style={{...btn_s_style}} uploadPreset="visita_preset" onSuccess={(r) => handleImages(r)} options={{maxFiles: 8,maxFileSize: 2*1024*1024}}
                        onOpen={() => alert("Solo se permiten subir hasta 8 imágenes por visita, con un tamaño máximo de 2MB cada una, ademas, seleccionando la imagen ya la sube, asegurarse de seleccionarlas bien.")}>
                        SUBIR IMAGENES
                    </CldUploadButton>
                </div>
                <div>
                    <button style={{...btn_s_style,marginTop: 15}} onClick={() => handleRegistrarVisita()}>REGISTRAR RECORRIDO</button>
                </div>
            </div>
        </div>
    )
}