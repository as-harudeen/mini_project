import fetchData from '../helper/fetchData.js'



const productContainer = document.getElementById('product-container')
const noDataContainer = document.getElementById('no-data-container')


function noData() {
    productContainer.innerHTML = '';
    noDataContainer.innerHTML = `
    <div class="mx-2  bg-white d-flex flex-column align-items-center justify-content-center p-2 px-4 py-4"
    style="border-radius: 14px; box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);">
    <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_3VDN1k.json"
    background="transparent" speed="5"
    style="width: 300px; height: 300px; opacity: 80%;" loop autoplay></lottie-player>
    <div class="d-flex flex-column align-items-center justify-content-center "
    style="color: #9e9e9e;">
    <h5>No Data</h5>
    </div>
    </div>
    `;
}


//To make it dynamic without reload
function buildProducts(products) {
    if (!products.length) return noData();
    productContainer.innerHTML = ''


    for (let product of products) {
        noDataContainer.innerHTML = '';
        productContainer.innerHTML += `
        <div class="container bg-white ProductCard m-2 mx-4"
        data-category-id="${product._id}">
        <!-- image rendering  -->
        <a href="/products/${product._id}">
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


categoryContainers.forEach(function (container) {
    // Add a click event listener to each category-container element
    container.addEventListener('click', function () {
        // Find the sibling element with the class "sub-category"
        const subCategory = this.nextElementSibling;

        // Toggle the visibility of the sub-category element
        subCategory.classList.toggle('d-none');
    });


});



//Sub category filtering
let checkedSubCate = []//this for {sub_category: {$in:__}}
const checkBoxes = document.querySelectorAll('.sub-check')

for (let checkbox of checkBoxes) {//Adding eventListner to every subcategory checkboxes
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) checkedSubCate.push(checkbox.value)
        else {
            checkedSubCate = checkedSubCate.filter(sub => sub != checkbox.value)
        }
        rebuildPaginationBtn = true
        fetchProducts() //Once event emit refetch and showing
    })
}



//Sort filter
const sortInp = document.getElementById('sortSelect')
let sort = {}//this is for req.query.sort

sortInp.addEventListener('change', () => {
    sort = sortBy()//calling function it return an object
    fetchProducts()//refetch and showing
})


function sortBy() {
    const sortInpVal = sortInp.value
    if (sortInpVal == 'highToLow') return { product_price: -1 }
    else if (sortInpVal == 'lowToHigh') return { product_price: 1 }
    else if (sortInpVal == 'lastest') return { timestamp: -1 }
    return {}
}


const searchInputHandler = () => {

    clearTimeout(typingTimer)
    //This is for don't activate until user complete his word
    //By using this it will reduce the ammount of fetching
    typingTimer = setTimeout(() => {
        searchVal = searchInp.value.trim()
        rebuildPaginationBtn = true
        fetchProducts()
    }, 1000)
}


//Serching
const searchInp = document.querySelector('.search')
let searchVal = ''//seting as global variable

let typingTimer
searchInp.addEventListener('keyup', searchInputHandler);


const limit = 3
let rebuildPaginationBtn = true //for build first pagination buttons


//fetching products with condition
const fetchProducts = async (page = 1) => {
    const pagination = { //limiting
        skip: (page - 1) * limit,
        limit
    }

    let url = `/rest/get-products?pagination=${JSON.stringify(pagination)}`
    const option = {}

    if (checkedSubCate.length) option.sub_category = { $in: checkedSubCate }
    //Adding new key to option if there is someting on searchbar
    if (searchVal) option.product_name = { $regex: `^${searchVal}`, $options: 'i' }


    url += `&option=${JSON.stringify(option)}`//adding option query
    url += `&sort=${JSON.stringify(sort)}` //adding sort query

    const response = await fetchData(url, 'GET')
    const products = await response.json()

    buildProducts(products)
    if (rebuildPaginationBtn) {
        rebuildPaginationBtn = false
        btnsCount(option)//build pagenation button
    }
}






//PAGENATION
const btnsCount = async (option) => {
    console.log();
    let url = '/doc_count/products'
    //this will return doc count that matching certain condition
    if (option) url += `?option=${JSON.stringify(option)}`
    const res = await fetchData(url, 'GET')
    const totalProductsCount = await res.text()
    //Building pagination buttons
    buildPagenationBtns(Math.ceil(+totalProductsCount / limit))
}

//declared as a global
const paginationContainer = document.getElementById('pagination-container')


//this is for building pagination buttons
function buildPagenationBtns(btnsLen) {
    paginationContainer.innerHTML = ''
    if (!btnsLen) return
    paginationContainer.innerHTML += `
    <button id="prev-btn" class="btn btn-dark">prev</button>
    <button value="1" class='page-btn btn btn-outline-dark'>1</button>`
    for (let i = 2; i <= btnsLen; i++) {
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

function paginationBtnEventHandler() {

    btns = paginationContainer.querySelectorAll('.page-btn')
    selectedBtn = paginationContainer.querySelector(".btn-outline-dark")

    for (let btn of btns) {
        btn.addEventListener('click', () => {
            const className = 'btn-outline-dark'
            selectedBtn.classList.remove(className)
            btn.classList.add(className)
            selectedBtn = btn
            fetchProducts(+btn.value)
            prevAndNextDisableHandler()
        })
    }
}


let prev_btn
let next_btn

function prevAndNextDisableHandler() {
    if (selectedBtn.value == 1) prev_btn.disabled = true
    else prev_btn.disabled = false
    if (selectedBtn.value == btns.length) next_btn.disabled = true
    else next_btn.disabled = false
}


function prevNextBtnEvent() {
    prev_btn = paginationContainer.querySelector('#prev-btn')
    next_btn = paginationContainer.querySelector('#next-btn')

    prev_btn.addEventListener('click', () => btns[selectedBtn.value - 2].click())
    next_btn.addEventListener('click', () => btns[selectedBtn.value].click())

}



const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

const search = params.q;


if(search) {
    searchInp.value = search;
    searchVal = search.trim();
    rebuildPaginationBtn = true;
    searchInp.focus();
    fetchProducts();
} else fetchProducts()//For building first Time