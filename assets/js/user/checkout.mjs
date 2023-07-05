import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"


// const full_nameSPAN = document.querySelector('.address-full-name')
// const house_nameSPAN = document.querySelector('.address-house-name')
// const streetSPAN = document.querySelector('.address-street')
// const citySPAN = document.querySelector('.address-city')
// const phoneSPAN = document.querySelector('.address-phone')
// const pincodeSPAN = document.querySelector('.address-pincode')
const token = getToken()


// function buildAddress (){
    
//     full_nameSPAN.textContent = full_name
//     house_nameSPAN.textContent = house_name
//     streetSPAN.textContent = street
//     citySPAN.textContent = city
//     phoneSPAN.textContent = phone
//     pincodeSPAN.textContent = pincode
// }

const currAddressContainer = document.getElementById('curr-address')
function buildAddress (){
    currAddressContainer.innerHTML = selectedAddressDiv.innerHTML
}



const res = await fetchData(`http://localhost:5000/user?option=${JSON.stringify({address: 1})}`, 'GET', null, token)
const data = await res.json()


const selectAddressContainer = document.querySelector('.select-address-container')
const selectAddressTemp = document.getElementById('select-address-temp')
let selectedAddressDiv 


for(let adrs of data.address){
    const addressTemp = selectAddressTemp.content.cloneNode(true)
    
    addressTemp.querySelector('.address-full-name').innerText = `${adrs.full_name}, `
    addressTemp.querySelector('.address-house-name').innerText = `${adrs.house_name}, `
    addressTemp.querySelector('.address-street').innerText = `${adrs.street}, `
    addressTemp.querySelector('.address-city').innerText = `${adrs.city}`
    addressTemp.querySelector('.address-phone').innerText = `Ph: ${adrs.phone}, `
    addressTemp.querySelector('.address-pincode').innerText = `Pin: ${adrs.pincode},`

    const addressDiv = addressTemp.querySelector('.address')
    addressDiv.addEventListener('click', ()=>{
        selectedAddressDiv.classList.remove('selected-address')
        addressDiv.classList.add('selected-address')
        selectedAddressDiv = addressDiv
        selectAddress.close()
        buildAddress()
    })


    selectAddressContainer.appendChild(addressTemp)
}

selectedAddressDiv = selectAddressContainer.querySelector('.address')
selectedAddressDiv.classList.add('selected-address')
buildAddress()


const selectAddressBtn = document.getElementById('select-address-btn')
const selectAddress = document.getElementById('select-address-dialog')
const closeDialogBtn = document.getElementById('close-dialog-btn')


selectAddressBtn.addEventListener('click', ()=>{
    selectAddress.showModal()
})

closeDialogBtn.addEventListener('click', ()=>{
    selectAddress.close()
})



//Confirm section

const proceedBtn = document.getElementById('proceed-btn')
const confirmDialog = document.getElementById('confirm-dialog')
const cancelBtn = document.getElementById('cancel-btn')
const confirmBtn = document.getElementById('confirm-btn')

proceedBtn.addEventListener('click', ()=>{
    buildConfirmcontainer()
    confirmDialog.showModal()
})

cancelBtn.addEventListener('click', ()=>{
    confirmDialog.close()
})
const totalPrice = document.getElementById('total-price').innerHTML
const confirmContainer = document.getElementById('confirm-container')

function buildConfirmcontainer(){
    confirmContainer.innerHTML = ''
    confirmContainer.innerHTML = '<h6>address</h6>'
    confirmContainer.innerHTML += selectedAddressDiv.innerHTML
    confirmContainer.innerHTML += '<h6 class="mt-3">Payment method</h6>'
    confirmContainer.innerHTML += '<p>Cash on delivery.</p>'
    confirmContainer.innerHTML += totalPrice
}

confirmBtn.addEventListener('click', ()=>{
    const body = {}
    
})