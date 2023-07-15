
const getToken = ()=>{
    const cookies = document.cookie
    const userTokenIdx = cookies.indexOf('userToken')
    if(userTokenIdx == -1 ) return window.location.href = '/api/login'
    let token = ''
    for(let i = userTokenIdx + 10; i < cookies.length; i++){
        if(cookies[i] == ';') break
        token += cookies[i]
    }

    return token
}

export default getToken