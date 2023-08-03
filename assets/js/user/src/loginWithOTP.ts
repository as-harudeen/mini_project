//Elements
const emailInput = document.getElementById('email')! as HTMLInputElement;
const sendOTPButton = document.getElementById('send-otp')! as HTMLButtonElement;
const OTPInput = document.getElementById('otp')! as HTMLInputElement;
const form = document.getElementById('form')! as HTMLFormElement;
const errDisplay  = document.getElementById('err-display')! as HTMLSpanElement;


const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let emailVal: string;

emailInput.addEventListener('keyup', ()=>{
    emailVal = emailInput.value;
    if(regEx.test(emailVal)){
        sendOTPButton.disabled = false;
    } else sendOTPButton.disabled = true;
})


sendOTPButton.addEventListener('click', async ()=>{
    const url = `/generate-otp/${emailVal}`;
    const res = await fetch(url, {
        method: 'GET',
    })
    if(res.ok) {
        alert('OTP Sended Success...');
        sendOTPButton.disabled = true;
        sendOTPButton.innerText = 'Resend';
        setTimeout(()=> {
            sendOTPButton.disabled = false;
        }, 60000)
    } else {
        const msg = await res.text();
        errDisplay.innerText = msg;
        setTimeout(()=>{
            errDisplay.innerText = '';
        }, 2000)
    }
})


form.addEventListener('submit', async (e: Event)=> {
    e.preventDefault();
    const body = {
        email: emailVal,
        OTP: OTPInput.value
    }
    const res = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if(res.ok) location.href = '/';
    else {
        errDisplay.innerText = 'Incorrect OTP';
        setTimeout(()=>{
            errDisplay.innerText = '';
        }, 2000)
    }
})


