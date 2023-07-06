import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"

const cartContainer = document.getElementById('cart-container')
const token = getToken()
console.log(token)

let dataToCheckout = []

const fetchCartDetails = async ()=>{

//for retrive cart data with some products fields
    const pipeline = [
        {
            $lookup: {
              from: "products",
              localField: "cart.product_id",
              foreignField: "_id",
              as: "cartItems"
            }
        },
        {
            $addFields: {
              cart: {
                $map: {
                  input: "$cart",
                  as: "cartItem",
                  in: {
                    $mergeObjects: [
                      "$$cartItem",
                      {
                        $arrayElemAt: [
                          "$cartItems",
                          { $indexOfArray: ["$cartItems._id", "$$cartItem.product_id"] }
                        ]
                      }
                    ]
                  }
                }
              }
            }
          },
        {
            $project: {
              cartItems: 0
            }
        }
    ]


    const res = await fetchData(`http://localhost:5000/cart?pipeline=${JSON.stringify(pipeline)}`, 'GET', null, token)
    const data = await res.json()
    const cart = data[0].cart

    dataToCheckout = []

    if(!cart) return false

    for(let item of cart){

        dataToCheckout.push({
          product_id: item.product_id,
          color: item.color,
          size: item.size,
          quantity: item.quantity
        })

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
          <input value="${item.quantity}" type="number" name="quantity" class="quantity">
          <button type="button" class="btn btn-light add-btn">+</button>
        </div>
        <button type="button" class="del-btn btn btn-danger">x</button>
        `


        const subBtn = cartItem.querySelector('.sub-btn')
        const addBtn = cartItem.querySelector('.add-btn')

        
        subBtn.addEventListener('click', async()=>{
            const cart_item_id = item.cart_item_id
            const quantityInp = cartItem.querySelector('.quantity')
            quantityInp.value--


            const findBy = {
                'cart.cart_item_id': cart_item_id
            }
            const body = {
                $inc: { "cart.$.quantity": -1 }
            }
            const url = `http://localhost:5000/cart/update?findBy=${JSON.stringify(findBy)}`
            const res = await fetchData(url, 'PUT', body, token)
            if(quantityInp.value == 1) subBtn.disabled = true
        })
        
        addBtn.addEventListener('click', async()=>{
            const cart_item_id = item.cart_item_id
            const quantityInp = cartItem.querySelector('.quantity')
            quantityInp.value++

            const findBy = {
                'cart.cart_item_id': cart_item_id
            }
            const body = {
                $inc: { "cart.$.quantity": 1 }
            }
            const url = `http://localhost:5000/cart/update?findBy=${JSON.stringify(findBy)}`
            const res = await fetchData(url, 'PUT', body, token)
          
            if(quantityInp.value == 1) subBtn.disabled = true
        })


        cartItem.dataset.value = item.cart_item_id
        cartContainer.appendChild(cartItem)
    }
console.log(dataToCheckout)

}

fetchCartDetails()



const checkoutBtn = document.getElementById('checkout-btn')
checkoutBtn.addEventListener('click', ()=>{
  location.href = `http://localhost:3000/api/checkout?products=${JSON.stringify(dataToCheckout)}&fromCart="true"`
})
