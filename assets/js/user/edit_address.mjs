import fetchData from "../helper/fetchData.js";
import { setSuccess, setError } from "../helper/setError&SetSuccess.js";
import getToken from "../helper/getToken.js";
import getId from "../helper/getIdfromUrl.js";


const address_id = getId()
const full_nameINP = document.getElementById('full_name')
const house_nameINP = document.getElementById('house_name')
const streetINP = document.getElementById('street')
const cityINP = document.getElementById('city')
const phoneINP = document.getElementById('phone')
const pincodeINP = document.getElementById('pincode')
const form = document.getElementById('form')
const msgContainer = document.getElementById('msg-display')
const token = getToken()


let x_full_name = full_nameINP.value
let x_house_name = house_nameINP.value
let x_street = streetINP.value
let x_city = cityINP.value
let x_phone = phoneINP.value
let x_pincode = pincodeINP.value


let full_name, house_name, street, city, phone, pincode


form.addEventListener('submit', async(e)=>{
    e.preventDefault()

    full_name = full_nameINP.value.trim()
    house_name = house_nameINP.value.trim()
    street = streetINP.value.trim()
    city = cityINP.value.trim()
    phone = phoneINP.value.trim()
    pincode = pincodeINP.value.trim()

    if(validate()){
        const body = {$set: {}}

        if(x_full_name != full_name) body.$set['address.$.full_name'] = full_name
        if(x_house_name != house_name) body.$set['address.$.house_name'] = house_name
        if(x_street != street) body.$set['address.$.street'] = street
        if(x_city != city) body.$set['address.$.city'] = city
        if(x_phone != phone) body.$set['address.$.phone'] = phone
        if(x_pincode != pincode) body.$set['address.$.pincode'] = pincode


        if(Object.keys(body.$set).length){
            const findBy = { 'address._id': address_id}
            const res = await fetchData(`http://localhost:5000/profile/update?findBy=${JSON.stringify(findBy)}`, 'PUT', body, token)
            if(res.ok) {

                x_full_name = full_name
                x_house_name = house_name
                x_city = city
                x_street = street
                x_phone = phone
                x_pincode = pincode


                const successMsg = document.createElement('p')
                successMsg.classList.add('text-success', 'fw-bold')
                successMsg.innerText = "Updated success"

                msgContainer.appendChild(successMsg)

                setTimeout(()=>{
                    msgContainer.removeChild(successMsg)
                }, 3000)
            }
        } else {
            const errMsg = document.createElement('p')
            errMsg.classList.add('text-danger', 'fw-bold')
            errMsg.innerText = 'No changes..!'

            msgContainer.appendChild(errMsg)
            setTimeout(()=>{
                msgContainer.removeChild(errMsg)
            }, 3000)
        }
    }

})


function validate(){
    let valid = true

    if(full_name == ''){
        setError(full_nameINP, "Full name cant'be empty")
        valid = false
    } else setSuccess(full_nameINP)

    if(house_name == ''){
        setError(house_nameINP, "House can't be empty")
        valid = false
    } else setSuccess(house_nameINP)

    if(street == ''){
        setError(streetINP, "Street can't be empty")
        valid = false
    } else setSuccess(streetINP)

    if(city == ''){
        setError(cityINP, "City can't be empty")
        valid = false
    } else setSuccess(cityINP)

    if(phone == ''){
        setError(phoneINP, "Phone can't be empty")
        valid = false
    } else setSuccess(phoneINP)

    if(pincode == ''){
        setError(pincodeINP, "Pincode cant' be empty")
        valid = false
    } else setSuccess(pincodeINP)

    return valid
}
