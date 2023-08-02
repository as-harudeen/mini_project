import getToken from "../helper/getToken.js"
import fetchData from "../helper/fetchData.js"

const token = getToken()
const order = document.getElementById('order_id')
const orderId = order.dataset.order_id
const subId = order.dataset.sub_id

const confirmDialog = document.getElementById('confirm-dialog')

confirmDialog.querySelector('.confirm-dialog-head').innerHTML = "Cancell order"
confirmDialog.querySelector('.confirm-dialog-body').innerHTML = "Do you want to cancell this order?"

document.getElementById('order-cancel-btn').addEventListener('click', async()=>{
    confirmDialog.showModal()
})

confirmDialog.querySelector('.cancel-btn').addEventListener('click', ()=>{
    confirmDialog.close()
})

confirmDialog.querySelector('.confirm-btn').addEventListener('click', async ()=>{
    const res = await fetchData(`/rest/order/cancelrequest/${orderId}/${subId}`, 'PUT', {}, token)
    if(res.ok){
        confirmDialog.close()
        document.getElementById('cancel-order-btn-container').innerHTML = `
        <form action="/Shop" method="get">
        <button class="btn btn-success" style="width: 100%; border-radius: 10px;font-size: 13px;">Order Again</button>
        </form>`

        document.getElementById("order_status").innerHTML = `<span class="badge rounded-pill bg-warning">Cancel Requested</span>`
    }
})