const form = document.getElementById('form')
const usernameInp = document.getElementById('username')
const emailInp = document.getElementById('email')
const passwordInp = document.getElementById('password')
const confirmPasswordInp = document.getElementById('confirm_password')

//OTP Handler
const otpInp = document.getElementById('otp')
const sendOTP_btn = document.getElementById('send-otp')
const verifyOTP_btn = document.getElementById('verify-otp')
let verified = false
const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


//For enable OTP buttons
emailInp.addEventListener('keyup', async ()=>{
    verified = false
    console.log("HIHIHI")
    if(regEx.test(emailInp.value.trim())){
        const response = await fetchData('get-user', 
        'POST', 
        {
            email: emailInp.value.trim()
        })

        if(response.ok) return setError(emailInp, 'Email already taken')
        setSuccess(emailInp)
        sendOTP_btn.disabled = false
        verifyOTP_btn.disabled = false
        
    } else {
        sendOTP_btn.disabled = true
        verifyOTP_btn.disabled = true

    }
})



form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = usernameInp.value.trim() 
    const email = emailInp.value.trim()
    const password = passwordInp.value.trim()
    const confirm_password = confirmPasswordInp.value.trim()

    const body = {
        username,
        email,
        password
    }
    const response = await fetchData('get-user', 'POST', body)

    if(response.ok){
        const userData = await response.json()
        setSuccess(emailInp)
        setSuccess(usernameInp)

        if(userData.user.email === email) setError(emailInp, 'Email Already taken')
        if(userData.user.username === username) setError(usernameInp, "Not available")
    }
    else {
        let validate = checkValid(username, email, password, confirm_password) 
        if(validate && verified) {
            const res = await fetchData('/api/register', 'POST', body)
            if(res.ok) window.location.href = '/api/login'
            else console.log("Internal error")
        } else if (validate && !verified) setError(otpInp, "Not verified..!")
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



//Validation
const checkValid = (username, email, password, confirm_password)=>{
    let NoErr = true
    if(username == ''){
        setError(usernameInp, 'Please Provide Username.')
        NoErr = false
    }else {
        setSuccess(usernameInp)
    }

    if(regEx.test(email)){
        setSuccess(emailInp)
    } else {
        setError(emailInp, 'Please Provide valid Email.')
        NoErr = false
    }
    
    if(password.length < 8){
        setError(passwordInp, "Password should be at least 8 character.")
        NoErr = false
    } else {
        setSuccess(passwordInp)
        if(password != confirm_password){
            setError(confirmPasswordInp, "Not Match.")
            NoErr = false
        } else {
            setSuccess(confirmPasswordInp)
        }
    }

    return NoErr
}



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
        const data = await response.text()
        console.log(JSON.parse(data).OTP)
    }
})


verifyOTP_btn.addEventListener('click', async()=>{
    const response = await fetchData('/api/verify-otp', 'POST', {OTP: otpInp.value})
    if(response.ok) {
        verified = true
        setSuccess(otpInp)
    }
    else setError(otpInp, 'Not match')
})



