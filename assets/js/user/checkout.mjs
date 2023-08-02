import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"



const token = getToken()




const currAddressContainer = document.getElementById('curr-address')//Selected address
function buildAddress (){//Change / building the selected address
    currAddressContainer.innerHTML = selectedAddressDiv.innerHTML
}


//fetching address
const res = await fetchData(`/rest/user?option=${JSON.stringify({address: 1})}`, 'GET', null, token)
const data = await res.json()

//address for select
const selectAddressContainer = document.querySelector('.select-address-container')
const selectAddressTemp = document.getElementById('select-address-temp')
let selectedAddressDiv 

if(data.address.length === 0) {
    alert("Please add address first...!\nRedirecting to Address page.");
    setTimeout(()=> {
        location.href = '/api/profile/address';
    }, 2000)
}

for(let adrs of data.address){//building address's
    const addressTemp = selectAddressTemp.content.cloneNode(true)
    
    addressTemp.querySelector('.address-full-name').innerText = `${adrs.full_name}, `
    addressTemp.querySelector('.address-house-name').innerText = `${adrs.house_name}, `
    addressTemp.querySelector('.address-street').innerText = `${adrs.street}, `
    addressTemp.querySelector('.address-city').innerText = `${adrs.city}`
    addressTemp.querySelector('.address-phone').innerText = `Ph: ${adrs.phone}, `
    addressTemp.querySelector('.address-pincode').innerText = `Pin: ${adrs.pincode},`

    const addressDiv = addressTemp.querySelector('.address')
    addressDiv.addEventListener('click', ()=>{ //change address event
        selectedAddressDiv.classList.remove('selected-address')
        addressDiv.classList.add('selected-address')
        selectedAddressDiv = addressDiv
        selectedAddressDiv.dataset.addressId = adrs._id
        selectAddress.close()
        buildAddress()
    })


    selectAddressContainer.appendChild(addressTemp)
}

selectedAddressDiv = selectAddressContainer.querySelector('.address')//for pre address build
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
    confirmContainer.innerHTML += `<p>${selectedPayment.dataset.method}</p>`
    confirmContainer.innerHTML += `<h6>Total:- </h6>${grant_total_price.innerText}`;
}

const curUrl = location.href
const contentDiv = document.getElementById('checkout-content-div')
const successContainer = document.getElementById('success-container')
const successTemp = document.getElementById('success-temp')


confirmBtn.addEventListener('click', async ()=>{

    confirmDialog.close()
    if (selectedPayment.dataset.method === 'Razorpay') {
        const isSuccess = await razorpayHandler();
        console.log(isSuccess);
        if (!isSuccess) {
          console.log('Payment failed');
          return; // Exit the event listener function
        }
    }
    const body = {
        address_id: selectedAddressDiv.dataset.addressId,
        payment_method: selectedPayment.dataset.method,
        coupon_id: prev_applyed_coupon?._id,
        wallet_amount: total_wallet_amount - walletAmount
    }
    let url = 'order'
    if(curUrl.includes('fromCart')) url += '?fromCart="true"'
    const res = await fetchData(url, 'POST', body)
    if(res.ok){
        cancelBtn.click()
        contentDiv.innerHTML = ""
        const success = successTemp.content.cloneNode(true)
        success.querySelector('.success-msg').innerText = 'Order successfully'
        const navigator = success.querySelector('.success-navigator')
        navigator.href = '/'
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



//fetching available coupon
const response = await fetchData('/rest/getcoupons', 'GET', null, token)
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
    const isThisCouponAllowed = (total_price * .15) >= coupons[val]?.coupon_value//put a restriction to avoid coupon missuse
    if(coupons[val] && coupons[val] != prev_applyed_coupon && isThisCouponAllowed){

        const dis_amount = +coupons[val].coupon_value + +discount_price.innerText
        discount_price.innerText = dis_amount
        grant_total_price.innerText = total_price - dis_amount
        apply_coupon_msg.innerText = prev_applyed_coupon ? "Coupon replaced with previous coupon" : "Coupon Applyed"
        prev_applyed_coupon = coupons[val]
        apply_coupon_msg.classList.add('text-success')

        setTimeout(()=>{
            apply_coupon_msg.innerText = ''
            apply_coupon_msg.classList.remove('text-success')
        }, 2000)
    }
    else {
        if(!coupons[val]) apply_coupon_msg.innerText = "Provide available coupon"
        else {
            if(!isThisCouponAllowed) apply_coupon_msg.innerHTML = `Total price should more than <b>${Math.floor(coupons[val].coupon_value / .15)}</b> for using this coupon`
            else apply_coupon_msg.innerText = "Coupon already selected"
        } 
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



//performing with payment method
const paymentMethods = document.querySelectorAll('.payment-method')
let selectedPayment = document.querySelector('.selected-payment')

for(let method of paymentMethods){
    method.addEventListener('click', ()=>{
        selectedPayment.classList.remove('selected-payment')
        method.classList.add('selected-payment')
        selectedPayment = method
    })
}

const razorpayHandler = async ()=>{

    return new Promise(async (resolve, reject)=>{

        const url = '/razorpay/createOrder'
        const res = await fetchData(url, 'POST', {})
    if(res.ok){
        const order = await res.json()
        const options = {
            key: order.key_id,
            currency: 'INR',
            amount: order.amount,
            name: 'HESHOP',
            description: 'Test transaction',
            image: '',
            order_id: order._id,
            handler: (response)=>{
                resolve(true)
            },
            prefill: {
                name: 'AchuBSL',
                email: "AchuBSL@testing.node",
                contanct: 753638374
            },
            notes: {
                address: 'Razorpay Corporate Office'
            },
            theme: {
                color: '#3399cc'
            }

        }       
        const rzp = new Razorpay(options)
        rzp.open()

    } else reject()
})
}


//Performing with wallet
const walletDisplay = document.getElementById('wallet-dis')
const walletInp = document.getElementById('wallet-inp')
const walletUseBtn = document.getElementById('wallet-use-btn')
const walletMsg = document.querySelector('.wallet-msg')

let walletAmount = walletDisplay.innerText
const total_wallet_amount = walletAmount

walletUseBtn.addEventListener('click', ()=>{
    const inp_val = walletInp.value
    if(+inp_val > +walletAmount){
        const msg = document.createElement('p')
        msg.classList.add('text-danger')
        msg.innerText = "Please choose within your wallet amount"
        walletMsg.appendChild(msg)
        setTimeout(()=>{
            walletMsg.removeChild(msg)
        }, 2000)
        return;
    }

    const dis_amount = +discount_price.innerText
    if(dis_amount + +inp_val > total_price){
        discount_price.innerText = total_price
        grant_total_price.innerText = 0
        walletAmount -= total_price - dis_amount
    } else {
        discount_price.innerText = +inp_val + dis_amount
        grant_total_price.innerText = total_price - (dis_amount + +inp_val)
        walletAmount -= inp_val
    }
    walletDisplay.innerText = walletAmount
})