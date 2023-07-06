import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"

const token = getToken()

const orderItem_trTEMP = document.getElementById('order_item_tr')
const order_tbody = document.getElementById('order-tbody')

const res = await fetchData('http://localhost:5000/profile/my_order', "GET", null, token)
if(res.ok){
    const data = await res.json()

    console.log(data)
    let count = 1
    for(let order of data){
        const order_item_tr = orderItem_trTEMP.content.cloneNode(true)
        
        order_item_tr.querySelector('.order-no').innerText = count++
        order_item_tr.querySelector('.order-img').src += order.product_images[0]
        if(order.order_status == "Processing"){
            order_item_tr.querySelector('.order-status-processing').innerText = 'Processing'
        } else order_item_tr.querySelector('.order-status-shipped').innerText = 'Shipped'
        order_item_tr.querySelector('.order-quantity').innerText = order.quantity
        order_item_tr.querySelector('.order-amount').innerText = order.product_price * order.quantity
        order_item_tr.querySelector('.order-data').innerText = '20/06/2003'

        order_tbody.appendChild(order_item_tr)
    }
}