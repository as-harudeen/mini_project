"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Elements
const emailInput = document.getElementById('email');
const sendOTPButton = document.getElementById('send-otp');
const OTPInput = document.getElementById('otp');
const form = document.getElementById('form');
const errDisplay = document.getElementById('err-display');
const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let emailVal;
emailInput.addEventListener('keyup', () => {
    emailVal = emailInput.value;
    if (regEx.test(emailVal)) {
        sendOTPButton.disabled = false;
    }
    else
        sendOTPButton.disabled = true;
});
sendOTPButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const url = `/api/generate-otp/${emailVal}`;
    const res = yield fetch(url, {
        method: 'GET',
    });
    if (res.ok) {
        alert('OTP Sended Success...');
        sendOTPButton.disabled = true;
        sendOTPButton.innerText = 'Resend';
        setTimeout(() => {
            sendOTPButton.disabled = false;
        }, 60000);
    }
    else {
        const msg = yield res.text();
        errDisplay.innerText = msg;
        setTimeout(() => {
            errDisplay.innerText = '';
        }, 2000);
    }
}));
form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const body = {
        email: emailVal,
        OTP: OTPInput.value
    };
    const res = yield fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (res.ok)
        location.href = '/api/';
    else {
        errDisplay.innerText = 'Incorrect OTP';
        setTimeout(() => {
            errDisplay.innerText = '';
        }, 2000);
    }
}));
