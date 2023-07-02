
const getToken = ()=>{
    const cookies = document.cookie
    if(cookies.startsWith('userToken=')){
        return cookies.substring(10)
    }
    return null
}

export default getToken