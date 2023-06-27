import fetchData from '../helper/fetchData.js'
import {setSuccess, setError} from '../helper/setError&SetSuccess.js'

const form = document.getElementById('form')
const emailInp = document.getElementById('email')
const passwordInp = document.getElementById('password')



form.addEventListener("submit", async (e)=>{
    e.preventDefault()


    console.log("inside event")

    const admin_email = emailInp.value.trim()
    const password = passwordInp.value.trim()

    const body = {
        admin_email,
        password
    }

    const response = await fetchData('/admin/login', 'POST', body)
    if(response.ok) window.location.href = '/admin/panel/category'
    else {
        const data = await response.json()
        console.log(data)
        if(data.msg === "email not found"){
            setError(emailInp, 'Not a Admin')
        } else {
            setSuccess(emailInp)
            setError(passwordInp, "Not match")
        }
    }
})
