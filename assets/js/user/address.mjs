import fetchData from "../helper/fetchData.js"
import { setSuccess, setError } from "../helper/setError&SetSuccess.js"
import getToken from "../helper/getToken.js"


const full_nameINP = document.getElementById('full_name')
const house_nameINP = document.getElementById('house_name')
const streetINP = document.getElementById('street')
const cityINP = document.getElementById('city')
const phoneINP = document.getElementById('phone')
const pincodeINP = document.getElementById('pincode')
const form = document.getElementById('form')
const token = getToken()



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


        const body = {
            $push: {address: {
                full_name,
                house_name,
                street,
                city,
                phone,
                pincode
            }}
        }

        const res = await fetchData('http://localhost:5000/profile/update', 'PUT', body, token)
        if(res.ok) console.log("All okey")
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






const address_container = document.querySelector('.address_container')



async function buildAddress (){
    const option = {
        address: 1, 
        _id: 0
    }
    const res = await fetchData(`http://localhost:5000/user?option=${JSON.stringify(option)}`, 'GET', null, token)
    if(res.ok){
        const data = await res.json()
        
        for(let address of data.address){
            const newAddress = document.createElement('div')
            newAddress.classList.add('address', 'p-3', 'pt-4', 'mt-3')
    
            newAddress.innerHTML = `
                <span style="color: #9a9a9a; font-size: 13.5px;">
                <Span>${address.full_name}, </Span>
                <Span>${address.house_name}, </Span>
                <Span>${address.street},</Span>
                <Span>${address.city},</Span>
                <br>
                <Span>Ph :${address.phone},</Span>
                <Span>Pin :${address.pincode}</Span>
                </span>
                <button  class="edit-btn btn btn-sm btn-dark">edit</button>
                <button class="del-btn btn btn-sm btn-danger">x</button>
                
                `
    
            address_container.appendChild(newAddress)
        }


    }
}
buildAddress()