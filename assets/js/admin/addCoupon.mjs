import fetchData from '../helper/fetchData.js'
import {setSuccess, setError} from '../helper/setError&SetSuccess.js'


const msg = document.getElementById('msg')
const form = document.getElementById('formCoupon')
const coupon_nameINP = document.getElementById('couponName')
const coupon_valueINP = document.getElementById('couponValue')
const coupon_expiry = document.getElementById('expiryDate')

let coupon_name, coupon_value, expiry_date 

const existingCouponNames = {}

form.addEventListener('submit', async(e)=>{
    e.preventDefault()

    coupon_name = coupon_nameINP.value.trim()
    coupon_value = +coupon_valueINP.value.trim()
    expiry_date = coupon_expiry.value

    if(!existingCouponNames[coupon_name]){
        if(validate()){
            setSuccess(coupon_nameINP)
    
            const body = {
                coupon_name,
                coupon_value,
                expiry_date
            }
        
    
            console.log("fetching")
            const res = await fetchData('', 'POST', body)
            if(res.ok){
                existingCouponNames[`${coupon_name}`] = true
                coupon_nameINP.value = ''
                coupon_valueINP.value = ''
                coupon_expiry.value = ''
    
                msg.innerText = 'Coupon Added success'
                msg.classList.add('text-success')
    
                setTimeout(()=>{
                    msg.innerText = ''
                    msg.classList.remove('text-success')
                }, 2000)
            }else {
                const err = await res.text()
    
                if(err == 'coupon name exist'){
                    setError(coupon_nameINP, "Coupon name is already exist")
                    existingCouponNames[`${coupon_name}`] = true
                }
            }
        }
    } else setError(coupon_nameINP, "Coupon name is already exist")

})


function validate(){
    let noErr = true

    if(coupon_name == ''){
        setError(coupon_nameINP, "coupon name can't be empty")
        noErr = false
    } else setSuccess(coupon_nameINP)

    if(coupon_value <= 0){
        setError(coupon_valueINP, "Coupon value cant't be less then 1")
        noErr = false
    } else if (!coupon_value){
        setError(coupon_valueINP, "Provide valid value")
        noErr = false
    } else if(coupon_value >= 1000){
        setError(coupon_valueINP, "Coupn value can't be more than 999")
    } else setSuccess(coupon_valueINP)


    const [year, month, day] = expiry_date.split('-')
    const chosenDate = new Date(year, month-1, day).getTime()
    let twoDayLater = new Date().getTime() + 2 * 24 * 45 * 60 * 1000

    console.log(chosenDate)
    console.log(twoDayLater)
    if(chosenDate <= twoDayLater){
        setError(coupon_expiry, "Expiry date can't less than 2 day")
        noErr = false
    } else setSuccess(coupon_expiry)

    return noErr
}