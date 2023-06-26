import fetchData from '../helper/fetchData.js'



const productContainer = document.getElementById('product-container')
//To make it dynamic without reload
function buildProducts (products){

    productContainer.innerHTML = ''

    for(let product of products){
        productContainer.innerHTML += `
        <div class="container bg-white ProductCard m-2 mx-4"
        data-category-id="${product._id}">
        <!-- image rendering  -->
        <a href="/detaildView/${product._id}">
            <div class="cardImage mb-2 d-flex align-items-center justify-content-center">
                <img src="/public/img/${product.product_images[0]}" alt="Product Image">
            </div>
        </a>
        <div class="px-3">
            <span class="text-dark">
                ${product.product_name}
            </span>
            <div class="p_price d-flex justify-content-between">
                <div class="price text-danger">₹ <text>
                       ${product.product_price}
                    </text> &nbsp; <span>₹ ${product.product_price + 100}</span></div>
                <div class="favor" style="cursor: pointer;">
                    <i class="fa-regular fa-heart"></i>
                </div>
            </div>
            <div class="rating d-flex align-items-center">
                <div class="star d-flex align-items-center">
                    <img src="/public/product/star.png" alt="">
                    <img src="/public/product/star.png" alt="">
                    <img src="/public/product/star.png" alt="">
                    <img src="/public/product/star.png" alt="">
                    <img src="/public/product/star.png" alt="">
                </div>
                <div class="value ms-2">(75)</div>
            </div>
        </div>
    </div>
        `
    }
}






//Adding dropdown on category
const categoryContainers = [...document.getElementsByClassName('category-container')];


categoryContainers.forEach(function(container) {
  // Add a click event listener to each category-container element
  container.addEventListener('click', function() {
    // Find the sibling element with the class "sub-category"
    const subCategory = this.nextElementSibling;

    // Toggle the visibility of the sub-category element
    subCategory.classList.toggle('d-none');
  });

  
});



//Sub category filtering
let checkedSubCate = []//this for {sub_category: {$in:__}}
const checkBoxes = document.querySelectorAll('.sub-check')

for(let checkbox of checkBoxes){//Adding eventListner to every subcategory checkboxes
    checkbox.addEventListener("change", ()=>{
        if(checkbox.checked) checkedSubCate.push(checkbox.value)
        else {
            checkedSubCate = checkedSubCate.filter(sub => sub != checkbox.value)
        }
        fetchProducts() //Once event emit refetch and showing
    })
}



//Sort filter
const sortInp = document.getElementById('sortSelect')
let sort = {}//this is for req.query.sort

sortInp.addEventListener('change', ()=>{
    sort = sortBy()//calling function it return an object
    fetchProducts()//refetch and showing
})


function sortBy (){ 
    const sortInpVal = sortInp.value
    if(sortInpVal == 'highToLow') return {product_price: -1}
    else if (sortInpVal == 'lowToHigh') return {product_price: 1}
    else if (sortInpVal == 'lastest') return {timestamp: -1}
    return {}
}


//Serching
const searchInp = document.querySelector('.search')
let searchVal = ''//seting as global variable

let typingTimer
searchInp.addEventListener('keyup', ()=>{

    clearTimeout(typingTimer)
    //This is for don't activate until user complete his word
    //By using this it will reduce the ammount of fetching
    typingTimer = setTimeout(()=>{
        searchVal = searchInp.value.trim()
        fetchProducts()
    }, 1500)
})


const limit = 3

//fetching products with condition
const fetchProducts = async (page = 1)=>{

    const pagination = { //limiting
        skip: (page - 1) * limit,
        limit
    }

    let url = `http://localhost:5000/get-products?pagination=${JSON.stringify(pagination)}`
    const option = {}

    if(checkedSubCate.length) option.sub_category = {$in: checkedSubCate}
    //Adding new key to option if there is someting on searchbar
    if(searchVal) option.product_name = {$regex: `^${searchVal}`, $options: 'i'}


    url += `&option=${JSON.stringify(option)}`//adding option query
    url += `&sort=${JSON.stringify(sort)}` //adding sort query

    const response = await fetchData(url, 'GET')
    const products = await response.json()

    buildProducts(products)
    btnsCount(option)//build pagenation button
}

fetchProducts()//For building first Time




//PAGENATION
const btnsCount = async(option)=>{
    let url = '/api/doc_count/products'
    //this will return doc count that matching certain condition
    if(option) url += `?option=${JSON.stringify(option)}`
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
    
    for(let btn of btns){
        btn.addEventListener('click', ()=>{
            const className = 'btn-outline-dark'
            selectedBtn.classList.remove(className)
            btn.classList.add(className)
            selectedBtn = btn
            prevAndNextDisableHandler()
            fetchProducts(+btn.value)
        })
    }
}


let prev_btn 
let next_btn 

function prevAndNextDisableHandler (){
    
    selectedBtn = paginationContainer.querySelector(".btn-outline-dark")

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