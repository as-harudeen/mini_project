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





  const buildOrders = async (page=1)=>{
    const option = {}//building option
    if(selectSearchByVal != 'all') option[`${selectSearchByVal}`] = {$regex: `^${searchVal}`, $options: 'i'}

    let url = `/admin/getorders`
    url += `?limit=${limit}`
    url += `&page=${page}`
    if(Object.keys(option).length) url += `&option=${JSON.stringify(option)}`
    const res = await fetchData(url, 'GET')
    if(res.ok){
        const orders = await res.json()
        orderTbody.innerHTML = ''
        orders.forEach((order)=> {buildOrder_tr(order)})
        if(rebuildPaginationBtn) {
          console.log("rebuilding")
          rebuildPaginationBtn = false
          btnsCount(option)//build pagenation button
      }
    } else console.log("Err")
  }

  
  
  
  //PAGENATION
  
  const limit = 3
  let rebuildPaginationBtn = true //for build first pagination buttons



const btnsCount = async(option, collection = 'orders')=>{
  let url = `/api/doc_count/${collection}`
  //this will return doc count that matching certain condition
  // if(option) url += `?option=${JSON.stringify(option)}`
  const res = await fetchData(url, 'GET')
  const totalProductsCount = await res.text()
  //Building pagination buttons
  buildPagenationBtns(Math.ceil(+totalProductsCount / limit))
}

//declared as a global
const paginationContainer = document.getElementById('pagination-container')


//this is for building pagination buttons
function buildPagenationBtns (btnsLen){
  paginationContainer.innerHTML = ''
  if(!btnsLen) return 
  paginationContainer.innerHTML += `
  <button id="prev-btn" class="btn btn-dark">prev</button>
  <button value="1" class='page-btn btn btn-outline-dark'>1</button>`
  for(let i = 2; i <= btnsLen; i++){
      paginationContainer.innerHTML += `<button value="${i}" class='btn page-btn'>${i}</button>`
  }
  paginationContainer.innerHTML += `<button id="next-btn" class="btn btn-dark">next</button>`

  paginationBtnEventHandler()
  prevNextBtnEvent()
  prevAndNextDisableHandler()
}

//declared some variables for reuse
let btns
let selectedBtn

function paginationBtnEventHandler(){

  btns = paginationContainer.querySelectorAll('.page-btn')
  selectedBtn = paginationContainer.querySelector(".btn-outline-dark")
  
  for(let btn of btns){
      btn.addEventListener('click', ()=>{
          const className = 'btn-outline-dark'
          selectedBtn.classList.remove(className)
          btn.classList.add(className)
          selectedBtn = btn
          buildOrders(+btn.value)
          prevAndNextDisableHandler()
      })
  }
}


let prev_btn 
let next_btn 

function prevAndNextDisableHandler (){
  if(selectedBtn.value == 1) prev_btn.disabled = true
  else prev_btn.disabled = false
  if(selectedBtn.value == btns.length) next_btn.disabled = true
  else next_btn.disabled = false 
}


function prevNextBtnEvent (){
  prev_btn = paginationContainer.querySelector('#prev-btn')
  next_btn = paginationContainer.querySelector('#next-btn')

  prev_btn.addEventListener('click', ()=>  btns[selectedBtn.value - 2].click())
  next_btn.addEventListener('click', ()=> btns[selectedBtn.value].click())
  
}



//Filter and search
const selectSearchBy = document.getElementById('search-by')
let selectSearchByVal = selectSearchBy.value
const searchInp = document.getElementById('searchInp')
let searchVal = ''

searchInp.addEventListener('keyup', ()=>{
  searchVal = searchInp.value.trim()
})

selectSearchBy.addEventListener('change', ()=>{
  selectSearchByVal = selectSearchBy.value
  if(searchVal) {
    rebuildPaginationBtn = true
    buildOrders()
  }
})

buildOrders()