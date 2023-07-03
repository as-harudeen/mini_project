

const getId = ()=>{
    const url = window.location.href

    let reversId = ''
    for(let i = url.length - 1; i >= 0; i--){
        if(url[i] == '/') break
        reversId += url[i]
    }
    
    let id = ''
    for(let i = reversId.length - 1; i >= 0; i--){
        id += reversId[i]
    }
    
    return id
}

export default getId