import fetchData from "../helper/fetchData.js";
import { setSuccess, setError } from "../helper/setError&SetSuccess.js";



const emailInp = document.getElementById('email');
const passwordInp = document.getElementById('password');
const loginBtn = document.getElementById('login-btn')

loginBtn.disabled = true



//OTP Handler
const otpInp = document.getElementById('otp')
const sendOTP_btn = document.getElementById('send-otp')
const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


//For enable OTP buttons
emailInp.addEventListener('keyup', async ()=>{
    if(regEx.test(emailInp.value.trim())){
        const response = await fetchData('get-user', 
        'POST', 
        {
            email: emailInp.value.trim()
        })

        if(response.ok) {
            setSuccess(emailInp)
            sendOTP_btn.disabled = false
            loginBtn.disabled = false
        } else setError(emailInp, 'Email is not found')
        
    } else {
        sendOTP_btn.disabled = true
        loginBtn.disabled = true
    }
})


loginBtn.addEventListener('click', async (e)=>{
    e.preventDefault()

    const email = emailInp.value.trim()
    const password = passwordInp.value.trim()

    const body = {
        email,
        password,
        OTP: otpInp.value.trim()
    }

    const response = await fetchData('/api/login', 'POST', body)
    if(response.ok) window.location.href = '/api'
    else {
        const data = await response.json()
        const err = data.err
        if(err == 'User not found') setError(emailInp, "User not found")
        else if(err == 'Incorrect password and OTP'){
            setSuccess(emailInp)
            setError(passwordInp, "Password Not Correct...")
            setError(otpInp, 'OTP Not Correct...')
        } else {
            setError(otpInp, "Please provide Password or OTP")
            setError(passwordInp, "Please provide Password or OTP")
        }
    }
    
})




//SendOTP
sendOTP_btn.addEventListener('click', async ()=>{
    const response = await fetchData(`/api/generate-otp/${emailInp.value.trim()}`, 'GET')
    if(response.ok) alert("OTP sended success.")
})

