import fetchData from '../helper/fetchData.js'


//Seting initial stage
const colors = document.querySelectorAll('.p_color')
colors[0].classList.add('selected_color')

const sizes = document.querySelectorAll('.p_size')
sizes[0].classList.add('selected_size')


let selected_color = colors[0]

//Adding click eventlistener to color divs
for(let color of colors){
    color.addEventListener('click', ()=>{
        selected_color.classList.remove('selected_color')
        color.classList.add('selected_color')
        selected_color = color
    })
}

let selected_size = sizes[0]

//Adding click EventListener to size div
for(let size of sizes){
    size.addEventListener('click', ()=>{
        selected_size.classList.remove('selected_size')
        size.classList.add('selected_size')
        selected_size = size
    })
}


const addToCart = document.getElementById('add_to_cart')

addToCart.addEventListener('click', ()=>{
    
})


const product_id = document.getElementById('product').dataset.value

//Checking.. if this product already exist in cart or not
// function isExistInCart (){
//     let url = 'http://localhost:5000'
// } 

const cart = {}

const fetchCartData = async ()=>{
    const res = await fetchData(`http://localhost:5000/cart/${product_id}`, 'GET')
    const data = await res.json()
    
    console.log(data)
}
fetchCartData()
