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
    console.log(selectedAddressDiv.dataset.addressId)
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
        selectedAddressDiv.dataset.addressId = adrs._id
        selectAddress.close()
        buildAddress()
    })


    selectAddressContainer.appendChild(addressTemp)
}

selectedAddressDiv = selectAddressContainer.querySelector('.address')
selectedAddressDiv.classList.add('selected-address')
selectedAddressDiv.dataset.addressId = data.address[0]._id
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

const confirmContainer = document.getElementById('confirm-container')

function buildConfirmcontainer(){
    confirmContainer.innerHTML = ''
    confirmContainer.innerHTML = '<h6>address</h6>'
    confirmContainer.innerHTML += selectedAddressDiv.innerHTML
    confirmContainer.innerHTML += '<h6 class="mt-3">Payment method</h6>'
    confirmContainer.innerHTML += '<p>Cash on delivery.</p>'
    confirmContainer.innerHTML += grant_total_price.innerText
}

const curUrl = location.href
const contentDiv = document.getElementById('checkout-content-div')
const successContainer = document.getElementById('success-container')
const successTemp = document.getElementById('success-temp')


confirmBtn.addEventListener('click', async ()=>{
    const body = {
        address_id: selectedAddressDiv.dataset.addressId,
        payment_method: 'COD',
        coupon_id: prev_applyed_coupon._id
    }
    let url = 'order'
    if(curUrl.includes('fromCart')) url += '?fromCart="true"'
    const res = await fetchData(url, 'POST', body)
    if(res.ok){
        cancelBtn.click()
        contentDiv.innerHTML = ""
        const success = successTemp.content.cloneNode(true)
        console.log(success)
        success.querySelector('.success-msg').innerText = 'Order successfully'
        const navigator = success.querySelector('.success-navigator')
        navigator.href = '/api/'
        navigator.innerText = "Home page."
        successContainer.appendChild(success)
    }

})


//Performing with coupon
const couponDialog = document.getElementById('coupon-dialog')
const closeBtn = couponDialog.querySelector('.close')
const openModalBtn = document.getElementById('openModalBtn')

closeBtn.addEventListener('click', ()=>{
    couponDialog.close()
})

openModalBtn.addEventListener('click', ()=>{
    couponDialog.showModal()
})




const response = await fetchData('http://localhost:5000/getcoupons', 'GET', null, token)
const couponsArr = await response.json()

const coupons = {}

const couponList = document.getElementById('couponList')
const couponTEMP = document.getElementById('coupon-temp')

let couponCount = 1
couponsArr.forEach((coupon)=>{
    coupons[`${coupon.coupon_name}`] = coupon
    const newCoupon = couponTEMP.content.cloneNode(true)

    newCoupon.querySelector('.coupon-no').innerText = couponCount++
    newCoupon.querySelector('.coupon-name').innerText = coupon.coupon_name
    newCoupon.querySelector('.coupon-value').innerText = coupon.coupon_value

    const date = new Date(coupon.expiry_date)

    newCoupon.querySelector('.coupon-expiry').innerText = date.toLocaleDateString()

    couponList.appendChild(newCoupon)
    
})


const apply_coupon_inp = document.getElementById('apply-coupon')
const apply_coupon_btn = document.getElementById('couponButton')
const apply_coupon_msg = document.getElementById('coupon-apply-msg')
let prev_applyed_coupon


apply_coupon_btn.addEventListener('click', ()=>{
    const val = apply_coupon_inp.value
    if(coupons[val] && coupons[val] != prev_applyed_coupon){

        const dis_amount = coupons[val].coupon_value
        discount_price.innerText = dis_amount
        grant_total_price.innerText = total_price - +dis_amount
        apply_coupon_msg.innerText = prev_applyed_coupon ? "Coupon replaced with previous coupon" : "Coupon Applyed"
        prev_applyed_coupon = coupons[val]
        apply_coupon_msg.classList.add('text-success')

        setTimeout(()=>{
            apply_coupon_msg.innerText = ''
            apply_coupon_msg.classList.remove('text-success')
        }, 2000)
    }
    else {
        apply_coupon_msg.innerText = coupons[val] ? "Coupon already used" : "Provide available coupon"
        apply_coupon_msg.classList.add('text-danger')

        setTimeout(()=>{
            apply_coupon_msg.innerText = ''
            apply_coupon_msg.classList.remove('text-danger')
        }, 2000) 
    }
})


const total_price = +document.getElementById('total_price').innerText
const grant_total_price = document.getElementById('grant_total')
const discount_price = document.getElementById('discount_price')

