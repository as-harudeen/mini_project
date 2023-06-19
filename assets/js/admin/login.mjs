import fetchData from '../helper/fetchData.js'
import {setSuccess, setError} from '../helper/setError&SetSuccess.js'

const form = document.getElementById('form')
const emailInp = document.getElementById('email')
const passwordInp = document.getElementById('password')


console.log(form)
console.log("HIHIIHIHIIHI")

// const verifyEmailBtn = document.getElementById('verify-email')
// const sendOTPBtn = document.getElementById('send-otp')
// const verifyOTPBtn = document.getElementById('verify-otp')
// const otpInp = document.getElementById('otp')
// let OTPSended = false



// emailInp.addEventListener("keyup", ()=>{
//     OTPSended = false
//     sendOTPBtn.disabled = true
//     verifyOTPBtn.disabled = true
// })


// verifyEmailBtn.addEventListener('click', async()=>{
//     const response = await fetchData('/api/admin/login', 
//     'POST', 
//     {
//         admin_email : emailInp.value.trim()
//     })

//     const data = await response.json()
//     if(data?.msg !== "email not found"){
//         setSuccess(emailInp)
//         sendOTPBtn.disabled = false
//         verifyOTPBtn.disabled = false
//     }
// })


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


//SendOTP
// sendOTPBtn.addEventListener('click', async ()=>{
//     const response = await fetchData('/api/generate-otp', 'GET')
//     if(response.ok){
//         OTPSended = true
//         const data = await response.text()
//         console.log(JSON.parse(data).OTP)
//     }
// })


// verifyOTPBtn.addEventListener('click', async()=>{
//     const response = await fetchData('/admin/login', 'POST', {admin_email: emailInp.value})
//     if(response.ok && OTPSended) {
//         // const response = await fetchData('/api/verify-otp', 'POST', {OTP: otpInp.value})
//         setSuccess(otpInp)
//         window.location.href = '/api/'
//     }
//     else setError(otpInp, 'Not match')
// })