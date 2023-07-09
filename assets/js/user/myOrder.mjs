import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"

const token = getToken()

const orderItem_trTEMP = document.getElementById('order_item_tr')
const order_tbody = document.getElementById('order-tbody')


async function buildOrders(){
    const res = await fetchData('http://localhost:5000/profile/my_order', "GET", null, token)
    if(res.ok){
        const data = await res.json()
    
        for(let order of data){
            const status = order.order_status
            if(status == "Processing" || status == "shipped"){
                buildNewOrders(
                    order.product_images[0], 
                    status, 
                    order.quantity,
                    order.total_price - order.discount_price,
                    order.delivery_date,
                    order._id
                )
            } else {
                buildOrderHistory(
                    order._id,
                    status,
                    order.product_images[0],
                    order.total_price - order.discount_price,
                    order.quantity
                )
            }

        }

    }

    if(newOrderCount == 1){
        order_tbody.innerHTML = 'Empty'
    }
    
    if(orderHistCount == 1){
        orderHistTbody.innerHTML = 'Empty'
    }
}

buildOrders()


let newOrderCount = 1
//building new orders
function buildNewOrders(img, status, qty, price, del_date, id){
    const order_item_tr = orderItem_trTEMP.content.cloneNode(true)
            
    order_item_tr.querySelector('.order-no').innerText = newOrderCount++
    order_item_tr.querySelector('.order-img').src += img
    if(status == "Processing"){
        order_item_tr.querySelector('.order-status-processing').innerText = 'Processing'
    } else order_item_tr.querySelector('.order-status-shipped').innerText = 'Shipped'
    order_item_tr.querySelector('.order-quantity').innerText = qty
    order_item_tr.querySelector('.order-amount').innerText = price * qty
    const date = new Date(del_date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    order_item_tr.querySelector('.order-date').innerText = `${day}/${month}/${year}`
    order_item_tr.querySelector('.view-btn').href = `/api/profile/order/${id}`

    order_tbody.appendChild(order_item_tr)
}





const orderHistTemp = document.getElementById('history_temp')
const orderHistTbody = document.getElementById('order_hist_tbody')


let orderHistCount = 1
function buildOrderHistory(id, status, img, price, qty){
    const tr = orderHistTemp.content.cloneNode(true)
    tr.querySelector('.order-no').innerText = orderHistCount++
    tr.querySelector('.order_pic_anchor').href += id

    const orderStatus = tr.querySelector('.order_status')
    const returnAnchor = tr.querySelector('.return-anchor')

    if(status == "canceled" || status === 'requested for cancel'){
        tr.querySelector('.canceled-tag').classList.remove('d-none')
        orderStatus.innerText = status
        orderStatus.classList.add('bg-danger')
        returnAnchor.innerText = "No Return"
        returnAnchor.classList.add('btn-danger')
    } else {
        orderStatus.innerText = status
        orderStatus.classList.add('bg-success')
        returnAnchor.innerText = "Return"
        returnAnchor.classList.add("btn-success")
        returnAnchor.href = `/api/return/${id}`
    }


    tr.querySelector('.order_pic_img').src += img
    tr.querySelector('.order_amount').innerText = price * qty
    tr.querySelector('.order-quantity').innerText = qty

    orderHistTbody.appendChild(tr)

}















