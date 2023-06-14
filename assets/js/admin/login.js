const form = document.querySelector('form')
const emailInp = document.getElementById('email')
const passwordInp = document.getElementById('password')
const verifyEmailBtn = document.getElementById('verify-email')
const sendOTPBtn = document.getElementById('send-otp')
const verifyOTPBtn = document.getElementById('verify-otp')
let OTPSended = false



emailInp.addEventListener("keyup", ()=>{
    OTPSended = false
    sendOTPBtn.disabled = true
    verifyOTPBtn.disabled = true
})


verifyEmailBtn.addEventListener('click', async()=>{
    const response = await fetchData('/api/admin/login', 
    'POST', 
    {
        admin_email : emailInp.value.trim()
    })

    const data = await response.json()
    if(data?.msg !== "email not found"){
        setSuccess(emailInp)
        sendOTPBtn.disabled = false
        verifyOTPBtn.disabled = false
    }
})


form.addEventListener("submit", async (e)=>{
    e.preventDefault()
    const admin_email = emailInp.value.trim()
    const password = passwordInp.value.trim()

    const body = {
        admin_email,
        password
    }

    const response = await fetchData('/api/admin/login', 'POST', body)
    
    if(response.status === 200) window.location.href = '/api/'
    else {
        const data = await response.json()

        if(data.msg === "email not found"){
            setError(emailInp, 'Not a Admin')
        } else {
            setSuccess(emailInp)
            setError(passwordInp, "Not match")
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
        OTPSended = true
        const data = await response.text()
        console.log(JSON.parse(data).OTP)
    }
})


verifyOTP_btn.addEventListener('click', async()=>{
    const response = await fetchData('/api/verify-otp', 'POST', {OTP: otpInp.value})
    if(response.ok && OTPSended) {
        setSuccess(otpInp)
        const res = await fetchData('/api/login-otp', 'POST', {email: emailInp.value})
        if(res.ok) window.location.href = '/api/'
    }
    else setError(otpInp, 'Not match')
})