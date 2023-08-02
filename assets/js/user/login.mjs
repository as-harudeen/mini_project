import fetchData from "../helper/fetchData.js";
import { setError } from "../helper/setError&SetSuccess.js";



const emailInp = document.getElementById('email');
const passwordInp = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

loginBtn.disabled = true;

const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


emailInp.addEventListener('keyup', ()=> {
    if(regEx.test(emailInp.value)){
        loginBtn.disabled = false
    } else loginBtn.disabled = true
})


loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = emailInp.value.trim()
    const password = passwordInp.value.trim()

    const body = {
        email,
        password
    }

    const response = await fetchData('/login', 'POST', body)
    if (response.ok) window.location.href = '/'
    else {
        setError(emailInp, 'Password of Email not correct')
        setError(passwordInp, 'Password or Email not correct')
    }

})


