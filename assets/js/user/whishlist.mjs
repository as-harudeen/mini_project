import getToken from "../helper/getToken.js"
import fetchData from "../helper/fetchData.js"


const product_temp = document.getElementById('whishlist_product')
const product_container = document.getElementById('product_container')

const token = getToken()
const url = 'http://localhost:5000/getwhishlist'

const res = await fetchData(url, 'GET', null, token)
if(res.ok) {
    const data = await res.json()

    for(let product of data){
        const newProduct = product_temp.content.cloneNode(true)
        
        newProduct.querySelector('.product_view_anchor').hfre += product._id
        newProduct.querySelector('.product_img').src += product.product_images[0]
        newProduct.querySelector('.product_name').innerText = product.product_name
        newProduct.querySelector('.product_final_price').innerText = product.product_price
        newProduct.querySelector('.product_actual_price').innerText = product.product_price + 500

        product_container.appendChild(newProduct)
    }
}
