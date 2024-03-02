import fetchData from "../helper/fetchData.js"
import getToken from "../helper/getToken.js"

const token = getToken()

const orderItem_trTEMP = document.getElementById('order_item_tr')
const order_tbody = document.getElementById('order-tbody')


async function buildOrders() {
    const res = await fetchData('/rest/profile/my_order', "GET", null, token)
    if (res.ok) {
        const data = await res.json()
        for (let order of data) {
            for (let sub_order of order.sub_orders) {
                const status = sub_order.order_status
                if (status == "Processing" || status == "shipped") {
                    buildNewOrders(
                        sub_order.product_images[0],
                        status,
                        sub_order.quantity,
                        sub_order.total_price,
                        sub_order.delivery_date,
                        order._id,
                        sub_order._id
                    )
                } else {
                    buildOrderHistory(
                        sub_order._id,
                        status,
                        sub_order.product_images[0],
                        sub_order.total_price,
                        sub_order.quantity,
                        order._id
                    )
                }
            }

        }

    }

    if (newOrderCount == 1) {
        order_tbody.innerHTML = 'Empty'
    }

    if (orderHistCount == 1) {
        orderHistTbody.innerHTML = 'Empty'
    }
}

buildOrders()


let newOrderCount = 1
//building new orders
function buildNewOrders(img, status, qty, price, del_date, id, sub_id) {
    const order_item_tr = orderItem_trTEMP.content.cloneNode(true)

    order_item_tr.querySelector('.order-no').innerText = newOrderCount++
    order_item_tr.querySelector('.order-img').src += img
    if (status == "Processing") {
        order_item_tr.querySelector('.order-status-processing').innerText = 'Processing'
    } else order_item_tr.querySelector('.order-status-shipped').innerText = 'Shipped'
    order_item_tr.querySelector('.order-quantity').innerText = qty
    order_item_tr.querySelector('.order-amount').innerText = price * qty
    const date = new Date(del_date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    order_item_tr.querySelector('.order-date').innerText = `${day}/${month}/${year}`
    order_item_tr.querySelector('.view-btn').href = `/profile/order/${id}/${sub_id}`

    order_tbody.appendChild(order_item_tr)
}





const orderHistTemp = document.getElementById('history_temp')
const orderHistTbody = document.getElementById('order_hist_tbody')


let orderHistCount = 1
function buildOrderHistory(id, status, img, price, qty, orderId) {
    const tr = orderHistTemp.content.cloneNode(true)
    tr.querySelector('.order-no').innerText = orderHistCount++
    tr.querySelector('.order_pic_anchor').href += id

    const orderStatus = tr.querySelector('.order_status')
    const returnAnchor = tr.querySelector('.return-anchor')

    if (status == "Canceled" || status === 'requested for cancel' || status == 'Requested for return') {
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
        returnAnchor.addEventListener('click', async function returnHandler() {
            const res = await fetch(`/return/${orderId}/${id}`, {
                method: 'PUT'
            })
            if (res.ok) {
                returnAnchor.removeEventListener('click', returnHandler);
                orderStatus.innerText = 'Requested for return';
                orderStatus.classList.add('bg-warning');
                returnAnchor.innerText = "no return";

            }
        })
    }


    tr.querySelector('.order_pic_img').src += img
    tr.querySelector('.order_amount').innerText = price * qty
    tr.querySelector('.order-quantity').innerText = qty

    orderHistTbody.appendChild(tr)

}















