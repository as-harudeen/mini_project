import fetchData from '../helper/fetchData.js'


const statusSelctor = document.getElementById('status__id')

const confirmDialog = document.getElementById('confirm-dialog')
confirmDialog.querySelector('.confirm-dialog-head').innerText = "Change order status"
confirmDialog.querySelector('.confirm-dialog-body').innerText = "Do you want to change the status?"
const confrimBtn = confirmDialog.querySelector('.confirm-btn')
const cancelBtn = confirmDialog.querySelector('.cancel-btn')


let prevSelectorValue = statusSelctor.value
statusSelctor.addEventListener('change', ()=>{
    confirmDialog.showModal()
})

cancelBtn.addEventListener('click', ()=> {
    statusSelctor.value = prevSelectorValue
    confirmDialog.close()
})

confrimBtn.addEventListener("click", async ()=>{
    const res = await fetchData(``, 'PUT', {status: statusSelctor.value})
    if(res.ok){
        prevSelectorValue = statusSelctor.value
        const order = await res.json()
        orderStatus.innerHTML = rebuildStatus({order_status: statusSelctor.value, isCanceled: statusSelctor.value == 'Canceled' ? true : false })
        confirmDialog.close()
    } 
    else cancelBtn.click()
})

const orderStatus = document.getElementById('orderStatus')
function rebuildStatus(order){
    if (order.isCanceled === false) { 
        if (order.order_status == 'Deliverd') {
           return '<span class="badge rounded-pill bg-success">Deliverd</span>'
        } else if (order.order_status == 'Processing') { 
          return '<span class="badge rounded-pill bg-warning">Processing</span>'
        } else if (order.order_status == 'Return Accepted') { 
           return '<span class="badge rounded-pill bg-success">Return Accepted</span>'
        } else if(order.order_status == 'requested for cancel'){ 
          return '<span class="badge rounded-pill bg-warning">Order Cancel Requested</span>'
        } else { 
           return `<span class="badge rounded-pill bg-info">${order.order_status}</span>`
       } 
   } else {
           return '<span class="badge rounded-pill bg-danger">Canceled</span>'
   } 
}