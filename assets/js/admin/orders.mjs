import fetchData from '../helper/fetchData.js'


  const orderTbody = document.getElementById('order-tbody')
  const order_tr_temp = document.getElementById('order-tr')

  let orderNo = 1
  function buildOrder_tr (order){
    const new_tr = order_tr_temp.content.cloneNode(true)
    
    new_tr.querySelector('.order-no').innerText = `#${orderNo}`
    new_tr.querySelector('.image-button').href += order._id
    new_tr.querySelector('.order-img').src += order.product_images[0]
    new_tr.querySelector('.order-username').innerText = order.username

    const payment_method = new_tr.querySelector('.order_payment_method')
    payment_method.innerText = order.payment_method

    if(order.payment_method == 'COD') payment_method.classList.add('bg-info')
    else payment_method.classList.add('bg-success')

    new_tr.querySelector('.order-phone').innerText = order.address.phone
    const isCanceled = new_tr.querySelector('.order-isCanceled')

    isCanceled.innerText = order.isCanceled
    if(order.isCanceled == true) isCanceled.classList.add('bg-danger')
    else isCanceled.classList.add('bg-success')

    const orderStatusSpan = new_tr.querySelector('.order-status')
    orderStatusSpan.innerText = order.order_status

    const status = order.order_status
    if(status == 'Processing') orderStatusSpan.classList.add('bg-warning')
    else if(status == 'Shipped') orderStatusSpan.classList.add('bg-info')
    else if(status == 'Return accepted') orderStatusSpan.classList.add('bg-success')
    else if(status == 'Deliverd') orderStatusSpan.classList.add('bg-success')
    else if(status == 'requested for cancel') orderStatusSpan.classList.add('bg-danger')
    else if(status == 'canceled') orderStatusSpan.classList.add('bg-danger')
    else  orderStatusSpan.classList.add('bg-info')
    
    orderTbody.appendChild(new_tr)
  }


  const buildOrders = async ()=>{
    console.log("HH")
    const res = await fetchData('/admin/getorders', 'GET')
    if(res.ok){
        console.log("H")
        const orders = await res.json()
        orders.forEach((order)=> {buildOrder_tr(order)})
    } else console.log("Err")
  }

  buildOrders()