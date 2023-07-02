import fetchData from '../helper/fetchData.js'
import getToken from '../helper/getToken.js'
import generateUniqueId from '../helper/generateId.js'



//Seting initial stage
const colors = document.querySelectorAll('.p_color')
colors[0].classList.add('selected_color')

const sizes = document.querySelectorAll('.p_size')
sizes[0].classList.add('selected_size')


let selected_color = colors[0]

//Adding click eventlistener to color divs
for(let color of colors){
    color.addEventListener('click', ()=>{
        selected_color.classList.remove('selected_color')
        color.classList.add('selected_color')
        selected_color = color
        isUIDExist()
        // console.log(id)
    })
}

let selected_size = sizes[0]

//Adding click EventListener to size div
for(let size of sizes){
    size.addEventListener('click', ()=>{
        selected_size.classList.remove('selected_size')
        size.classList.add('selected_size')
        selected_size = size
        isUIDExist()
        // console.log(id)
    })
}

const token = getToken()
const isExsting = {}
const pipeline = [{$project: { _id: 0, cart: 1}}]
//fetching user cart with using token
const res = await fetchData(`http://localhost:5000/cart?pipeline=${JSON.stringify(pipeline)}`, 'GET', null, token)
const data = await res.json()

for(let item of data[0].cart){//building exist cart item id
    isExsting[item.cart_item_id] = true
}

const product_id = document.getElementById('product').dataset.value
const addToCart = document.getElementById('add_to_cart')
let id

async function isUIDExist (){
    console.log(selected_color.dataset.value)
    console.log(selected_size.dataset.value)
    const name = product_id + selected_color.dataset?.value + selected_size.dataset?.value
    id = await generateUniqueId(name)
    
    if(isExsting[id]){
        addToCart.disabled = true
        addToCart.innerText = 'Already in cart'
        return true
    } else {
        addToCart.disabled = false
        addToCart.innerText = "Add to cart"
        return false
    }
}
isUIDExist()//for first checking


addToCart.addEventListener('click', async()=>{
    const url = 'http://localhost:5000/cart/update'
    console.log(id)
    const body = {
        product_id,
        color: selected_color.dataset.value,
        size: selected_size.dataset.value,
        quantity: 1,
        cart_item_id: id
    }
    const option = {
        $push: {cart: body}
    }
    const res = await fetchData(url, 'PUT', option, token)
    if(res.ok) {
        isExsting[id] = true
        addToCart.disabled = true
        addToCart.innerText = 'Item Added'
    }
})




