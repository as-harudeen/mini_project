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