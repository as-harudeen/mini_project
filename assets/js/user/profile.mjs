import fetchData from '../helper/fetchData.js'
import {setSuccess, setError} from '../helper/setError&SetSuccess.js'
import getToken from '../helper/getToken.js'

const form = document.getElementById('form')
const username = document.getElementById('username')
const email = document.getElementById('email')
const oldPassword = document.getElementById('password')
const newPassword = document.getElementById('new-password')
const confirmPassword = document.getElementById('new-confirm-password')
const topName = document.querySelector('.top-name')
const topEmail = document.querySelector('.top-email')
const errDisplay = document.querySelector('#err-display')
const token = getToken()
let oldUsername = username.value
let oldEmail = email.value
let emailVerified = false
let newPass, confirmPass

form.addEventListener('submit', async (e)=>{
    e.preventDefault()

    setSuccess(errDisplay)
    setSuccess(oldPassword)
    setSuccess(email)
    setSuccess(username)

    const currUsername = username.value.trim()
    const currEmail = email.value.trim()

    const url = '/rest/profile/update'
    const body = {}

    if(emailVerified) body.email = currEmail
    else {
        if(oldEmail != currEmail) setError(email, "Not verified")
    }
    if(currUsername != oldUsername) body.username = currUsername
    if(newPass){
        if(validatePass(newPass)){
            if(isConfirmPassCorrect()){
                body.password = newPass
                body.oldPassword = oldPassword.value.trim()
            }
        }
    }


    if(!Object.keys(body).length) setError(errDisplay, 'No change')
    else {
        const res = await fetchData(url, 'PUT', body, token)
        if(res.ok){
            topName.innerHTML = currUsername
            topEmail.innerHTML = currEmail
            oldPassword.value = ''
            newPassword.value = ''
            confirmPassword.value = ''

            const updated = await res.json()
            const p = document.createElement('p')
            for(let key of Object.keys(updated)){
                p.innerHTML += `${key} updated. <br>`
            }
            errDisplay.parentElement.appendChild(p)
            setTimeout(()=>{
                errDisplay.parentElement.removeChild(p)
            }, 3000)

            oldEmail = currEmail
            oldUsername = currUsername
        } else if(res.status == 400){
            const err = await res.text()
            if(err == 'Password incorrect'){
                setError(oldPassword, "Password incorrect")
            } else {
                setError(username, "Username or email is already exist")
                setError(email, "Username or email is already exist")
            }
        }

    }

})


newPassword.addEventListener('keyup', ()=>{
    newPass = newPassword.value.trim()
})
confirmPassword.addEventListener('keyup', isConfirmPassCorrect)




function isConfirmPassCorrect (){
    confirmPass = confirmPassword.value.trim()

    if(confirmPass != newPass){
        setError(confirmPassword, "Not match")
        return false
    } 
    else {
        setSuccess(confirmPassword)
        return true
    }
}


//validating new password
function validatePass(pass){

    if(pass.length < 8){
        setError(newPassword, "Password must be greater than 8")
        return false
    } else if (pass == oldPassword.value) {
        setError(newPassword, "Password can't same as current password")
        return false
    }
    setSuccess(newPassword)
    return true
}





const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sendOTPBtn = document.getElementById('send-otp-btn')
const verifyOTPBtn = document.getElementById('verify-otp-btn')
const otpInp = document.getElementById('verify-otp-inp')
const otpContainer = document.querySelector('.otp-btn-container')

email.addEventListener("keyup", ()=>{
    emailVerified = false
    if(!sendOTPBtn.classList.contains('d-none')){
        sendOTPBtn.classList.add('d-none')
    }
    const currEmail = email.value.trim()
    if(currEmail != oldEmail){
        if(emailRegex.test(currEmail)){
            sendOTPBtn.classList.remove('d-none')
        }
    }
})

sendOTPBtn.addEventListener('click', async ()=>{
    const currEmail = email.value.trim()
    const res = await fetchData(`generate-otp/${currEmail}`, 'GET')
    if(res.ok){
        const p = document.createElement('p')
        p.innerText = "OTP Sended success"
        otpContainer.appendChild(p)

        setTimeout(()=>{
            otpContainer.removeChild(p)
        }, 3000)

        otpContainer.classList.remove('d-none')
    }
})


verifyOTPBtn.addEventListener('click', async ()=>{
    setSuccess(otpInp)
    const res = await fetchData('verify-otp', 'POST', {OTP: otpInp.value.trim()})
    if(res.ok){
        emailVerified = true
        sendOTPBtn.classList.add('d-none')
        sendOTPBtn.classList.add('d-none')
        const p = document.createElement('p')
        p.innerText = "Verified success"

        otpContainer.appendChild(p)

        setTimeout(()=>{
            otpContainer.removeChild(p)
        }, 3000)
    } else {
        setError(otpInp, "Inccorect OTP")
    }
})


