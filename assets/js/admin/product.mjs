import fetchData from "../helper/fetchData.js"
import { setSuccess, setError } from "../helper/setError&SetSuccess.js"



//filter
const filterInp = document.getElementById('p_filter')
let filter 
filterInp.addEventListener('change', ()=>{
    filter = filterInp.value
    build()
})


//Search
const searchInp = document.getElementById('search')

let searchVal 
let typeTimer
searchInp.addEventListener('keyup', ()=>{

    clearTimeout(typeTimer)

    typeTimer = setTimeout(()=>{
        searchVal = searchInp.value.trim()
        build()
    }, 1000)

})




const productContainer = document.getElementById('products_container')


function noData() {
    productContainer.innerHTML = `
      <div class="d-flex justify-content-center align-items-center mx-auto p-2 mt-3">
      <div class="mx-2  bg-white d-flex flex-column align-items-center justify-content-center p-2 px-4 py-4"
      style="border-radius: 14px; box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);">
      <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_3VDN1k.json" background="transparent"
      speed="5" style="width: 300px; height: 300px; opacity: 80%;" loop autoplay></lottie-player>
      <div class="d-flex flex-column align-items-center justify-content-center " style="color: #9e9e9e;">
          <h5>No Data</h5>
      </div>
  </div>`
}

//build
async function build(){
    productContainer.innerHTML = ''
    const option = {}
    if(filter){
        if(filter == 'deleted') option.isDeleted = true
        else if(filter == 'undeleted') option.isDeleted = false
    }
    
    if(searchVal) option.product_name = {$regex: `^${searchVal}`, $options: 'i'}


    let url = `/admin/get-products?options=${JSON.stringify(option)}`
    // if(searchVal) url += `&prefix="${searchVal}"`
    const res = await fetchData(url, "GET")
    
    const products = await res.json()
    if(!products.length) return noData();
    products.forEach(product => {
        const newDiv = document.createElement('div')
        newDiv.innerHTML = `
        <div class="ad_product" style="background-image: url('/public/img/${product.product_images[0]}');">
        <button class="btn btn-sm btn-light ac_btn"> ${product.isDeleted ? 'Retrive' : 'Soft Delete'}</button>
        <div class="text-light p_details">
            <h6>${product.product_name}</h6>
            <h6>Rs ${product.product_price}</h6>
            <p>Qt-${product.product_stock}</p>
        </div>
        <a class="btn btn-sm btn-light edit_btn" href="/admin/panel/products/edit/${product._id}">Edit</a>
        </div>
        `
        const btn = newDiv.querySelector('button')
        btn.addEventListener('click', async()=>{
            const btnText = btn.innerText
            if(btnText == 'Retrive'){
                const res = await fetchData(`/admin/list/${product._id}`, 'PUT')
                if(res.ok) btn.innerText = 'Soft Delete'
            } else {
                const res = await fetchData(`/admin/unlist/${product._id}`, 'PUT')
                if(res.ok) btn.innerText = 'Retrive'
            }
        })

        productContainer.appendChild(newDiv)
    })

}
build()



const logout = document.getElementById('logout')
logout.addEventListener('click', async ()=>{
    const res = await fetchData('/admin/logout', 'DELETE')
    if(res.ok) window.location.href = '/admin/login'
})