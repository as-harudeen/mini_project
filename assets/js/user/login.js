const emailInp = document.getElementById('email');
const passwordInp = document.getElementById('password');
const form = document.getElementById('form')


//OTP Handler
const otpInp = document.getElementById('otp')
const sendOTP_btn = document.getElementById('send-otp')
const verifyOTP_btn = document.getElementById('verify-otp')
const resendOTP_btn = document.getElementById('resend-otp')
let verified = false
const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


//For enable OTP buttons
emailInp.addEventListener('keyup', async ()=>{
    verified = false
    if(regEx.test(emailInp.value.trim())){
        const response = await fetchData('get-user', 
        'POST', 
        {
            email: emailInp.value.trim()
        })

        if(response.ok) {
            setSuccess(emailInp)
            sendOTP_btn.disabled = false
            verifyOTP_btn.disabled = false
            resendOTP_btn.disabled = false
        } else setError(emailInp, 'Email is not found')
        
    } else {
        sendOTP_btn.disabled = true
        verifyOTP_btn.disabled = true
        resendOTP_btn.disabled = true
    }
})


form.addEventListener('submit', async (e)=>{
    e.preventDefault()

    const email = emailInp.value.trim()
    const password = passwordInp.value.trim()

    const body = {
        email,
        password
    }

    const response = await fetchData('/api/login', 'POST', body)
    if(response.ok) window.location.href = '/api'
    else {
        const data = await response.json()
        console.log(data)
        const err = data.err
        if(err == 'User not found') setError(emailInp, "User not found")
        else if(err == 'Incorrect password'){
            setSuccess(emailInp)
            setError(passwordInp, "Password Not Correct...")
        } else if ("email and password is mandatory") {
            setError(emailInp, "email and password is mandatory")
            setError(passwordInp, "email and password is mandatory")
        }
    }
    
})



//Fetch 
const fetchData = async (url, method, body) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (method === 'POST') {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(url, options);
  
    return response;
  };





  const setError = (element, message)=>{
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.err')

    errorDisplay.innerHTML = message
    inputControl.classList.add('err')
    inputControl.classList.remove('success')
}

const setSuccess = (element)=>{
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.err')

    errorDisplay.innerHTML = ''
    inputControl.classList.add('success')
    inputControl.classList.remove('err')
}




//SendOTP
sendOTP_btn.addEventListener('click', async ()=>{
    const response = await fetchData('/api/generate-otp', 'GET')
    if(response.ok){
        verified = true
        const data = await response.text()
        console.log(JSON.parse(data).OTP)
    }
})


verifyOTP_btn.addEventListener('click', async()=>{
    const response = await fetchData('/api/verify-otp', 'POST', {OTP: otpInp.value})
    if(response.ok && verified) {
        setSuccess(otpInp)
        const res = await fetchData('/api/login-otp', 'POST', {email: emailInp.value})
        if(res.ok) window.location.href = '/api/'
    }
    else setError(otpInp, 'Not match')
})