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
    })
}

const token = getToken()
const isExsting = {}
const option = {cart: 1, _id: 0}
//fetching user cart with using token
const res = await fetchData(`/rest/user?option=${JSON.stringify(option)}`, 'GET', null, token)
const data = await res.json()

if(data.cart){
    for(let item of data.cart){//building exist cart item id
        isExsting[item.cart_item_id] = true
    }
}


const product_id = document.getElementById('product').dataset.value
const addToCart = document.getElementById('add_to_cart')
let id

async function isUIDExist (){
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
    const url = '/rest/cart/update'
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



const buy_btn = document.getElementById('buy_now')

buy_btn?.addEventListener('click', ()=>{
    const data= [{
        product_id,
        color: selected_color.dataset.value,
        size: selected_size.dataset.value,
        quantity: 1
    }]
    location.href = `/checkout?products=${JSON.stringify(data)}`
})


//Whishlist
const msg_container = document.getElementById('msg-container')
const add_to_whishlist_btn = document.getElementById('add_to_whishlist')

add_to_whishlist_btn?.addEventListener('click', async ()=>{
    const url = '/rest/whishlist/add'
    
    const res = await fetchData(url, 'PUT', {product_id}, token)
    if(res.ok){
        const success_msg = document.createElement('h6')
        success_msg.classList.add('text-success')
        success_msg.innerText = 'Product added success'
        msg_container.appendChild(success_msg)

        add_to_whishlist_btn.innerText = 'Already in whishlist'
        add_to_whishlist_btn.disabled = true

        setTimeout(()=>{
            msg_container.removeChild(success_msg)
        }, 3000)
    } else {
        const err_msg = document.createElement('h6')
        err_msg.classList.add('text-danger')
        err_msg.innerText = "Opps something wrong"
        msg_container.appendChild(err_msg)

        setTimeout(()=>{
            msg_container.removeChild(err_msg)
        }, 3000)
    }
})



const selectedImage = document.getElementById('zoom');

const smallImgs = document.querySelectorAll('.smalImg');

for(let img of smallImgs) {
    img.addEventListener('click', (e)=> {
        selectedImage.src = e.currentTarget.src;
    })
}




