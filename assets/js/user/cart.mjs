import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"

const cartContainer = document.getElementById('cart-container')
const token = getToken()

let dataToCheckout = []//this for pass the data as query
let dataToCheckoutOBJ = {}//this for optimize updatation in product (eg.. quantity, remove product)
const product_stock = {}

function noData () {
    cartContainer.innerHTML = `
    <div class="mx-2  bg-white d-flex flex-column align-items-center justify-content-center p-2 px-4 py-4"
    style="border-radius: 14px; box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);">
    <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_3VDN1k.json"
    background="transparent" speed="5"
    style="width: 300px; height: 300px; opacity: 80%;" loop autoplay></lottie-player>
    <div class="d-flex flex-column align-items-center justify-content-center "
    style="color: #9e9e9e;">
    <h5>No Data</h5>
    </div>
    </div>`
}

const fetchCartDetails = async ()=>{

    const res = await fetchData(`/rest/cart`, 'GET', null, token)
    const cart = await res.json()
    // const cart = data[0].cart

    dataToCheckoutOBJ = {}

    if(!cart) return false
    if(!cart.length) return noData();
    for(let item of cart){
        const product_id = item.product_id
        dataToCheckoutOBJ[item.cart_item_id] = {
          product_id: product_id,
          color: item.color,
          size: item.size,
          quantity: item.quantity
        }
        
        if(product_stock[product_id]) product_stock[product_id].stock -= item.quantity
        else {
            product_stock[product_id] = {stock: item.product_stock - item.quantity, product_name: item.product_name}
        }

        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item', 
        'p-4', 'd-flex', 'justify-content-between', 
        'gap-3', 'align-items-center', 'my-4')
        cartItem.innerHTML = `
        <div class="cart-item-img">
        <img width="100px" src="/public/img/${item.product_images[0]}" alt="">
        </div>
        <div class="cart-itmem-name">${item.product_name}</div>
        <div>Rs ${item.product_price}</div>
        <div class="cart-item-color" style="background-color: ${item.color};"></div>
        <div>${item.size}</div>
        <div class="cart-item-action d-flex">
          <button type="button" class="btn btn-light sub-btn">-</button>
          <input disabled value="${item.quantity}" type="text" name="quantity" class="quantity">
          <button type="button" class="btn btn-light add-btn">+</button>
        </div>
        <button type="button" class="del-btn btn btn-danger">x</button>
        `


        const subBtn = cartItem.querySelector('.sub-btn')
        if(item.quantity == 1) subBtn.disabled = true
        const addBtn = cartItem.querySelector('.add-btn')
        if(item.quantity == 10 || product_stock[product_id].stock <= 0) addBtn.disabled = true
        
        const cart_item_id = item.cart_item_id
        const quantityInp = cartItem.querySelector('.quantity')

        
        subBtn.addEventListener('click', async()=>{
            quantityInp.value--

            const findBy = {
                'cart.cart_item_id': cart_item_id
            }
            const body = {
                $inc: { "cart.$.quantity": -1 }
            }
            const url = `/rest/cart/update?findBy=${JSON.stringify(findBy)}`
            const res = await fetchData(url, 'PUT', body, token)
            dataToCheckoutOBJ[item.cart_item_id].quantity--
            product_stock[product_id].stock++
            if(quantityInp.value == 1) subBtn.disabled = true
            if( 0 < product_stock[product_id]) addBtn.disabled = false
        })
        
        addBtn.addEventListener('click', async()=>{
            // const cart_item_id = item.cart_item_id
            // const quantityInp = cartItem.querySelector('.quantity')
            quantityInp.value++

            const findBy = {
                'cart.cart_item_id': cart_item_id
            }
            const body = {
                $inc: { "cart.$.quantity": 1 }
            }
            const url = `/rest/cart/update?findBy=${JSON.stringify(findBy)}`
            const res = await fetchData(url, 'PUT', body, token)

            dataToCheckoutOBJ[item.cart_item_id].quantity++
            product_stock[product_id].stock--
            subBtn.disabled = false
            // if(quantityInp.value > 1) subBtn.disabled = false
            if(quantityInp.value >= 10 || product_stock[product_id].stock <= 0) addBtn.disabled = true
        })


        const deleteBtn = cartItem.querySelector('.del-btn')
        
        deleteBtn.addEventListener("click", ()=>{
           item_todelete.id = item.cart_item_id
           item_todelete.item = cartItem
           confirmDialog.showModal()
        })


        cartItem.dataset.value = item.cart_item_id
        cartContainer.appendChild(cartItem)
    }

}

fetchCartDetails()



const checkoutBtn = document.getElementById('checkout-btn')
checkoutBtn.addEventListener('click', ()=>{
  dataToCheckout = []
  if(isStockExeed()){
      for(let value of Object.values(dataToCheckoutOBJ))dataToCheckout.push(value)
      location.href = `/checkout?products=${JSON.stringify(dataToCheckout)}&fromCart="true"`
  }
})



const confirmDialog = document.getElementById('confirm-dialog')
confirmDialog.querySelector('.confirm-dialog-head').innerText = 'Deleting cart item'
confirmDialog.querySelector('.confirm-dialog-body').innerText = "Do you really want to delete this item from cart"
const confirmBtn = confirmDialog.querySelector('.confirm-btn')
const cancelBtn = confirmDialog.querySelector('.cancel-btn')
let item_todelete = {}

cancelBtn.addEventListener("click", ()=>{
    confirmDialog.close()
})

confirmBtn.addEventListener("click", async ()=>{
    const url = '/rest/cart/update'
    const body = {$pull: {cart:{cart_item_id: item_todelete.id}}}
    const res = await fetchData(url, 'PUT', body, token)
    if(res.ok) {
        product_stock[dataToCheckoutOBJ[item_todelete.id].product_id].stock += dataToCheckoutOBJ[item_todelete.id].quantity
        delete dataToCheckoutOBJ[item_todelete.id]
        cartContainer.removeChild(item_todelete.item)
        confirmDialog.close()
    }
})

//checking there is stock
const msgContainer = document.getElementById('msg-container')
function isStockExeed(){
    let allOk = true
    for(let product of Object.values(product_stock)){
        if(product.stock < 0){
            const msg = document.createElement('h6')
            msg.classList.add('text-danger', 'p-4')
            msg.innerText = `${product.product_name} not available this much stock please decrease`
            msgContainer.appendChild(msg)
            setTimeout(()=>{
                msgContainer.removeChild(msg)
            }, 3000)
            allOk = false
        }
    }
    return allOk
}