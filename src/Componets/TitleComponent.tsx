


export default function TitleComponent ({txt,secondary}:{txt: string,secondary:boolean}) {
    
    return  (
    <h2 style={{color: secondary ? '#4A6EE8' : "white"}}>
        {txt}
    </h2>
    )

}