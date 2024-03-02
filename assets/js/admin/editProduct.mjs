import fetchData from '../helper/fetchData.js'
import {setSuccess, setError} from '../helper/setError&SetSuccess.js'


const url = window.location.href;

let productId = ''
let productId_rev = ''

for(let i = url.length - 1; i > 0; i--){
    if(url[i] == '/') break
    productId_rev += url[i]
}

for(let idx = productId_rev.length - 1; idx >= 0; idx--){
    productId += productId_rev[idx]
}

let product = {}

let productsName = []
const resp = await fetchData('/admin/get-products', 'GET')
if(resp.ok){
    const dt = await resp.json()
    for(let i = 0; i < dt.length; i++){
        if(productId == dt[i]._id) product = dt[i]
        else productsName.push(dt[i].product_name.toLowerCase())
    }
}



//Performing with SELECTOR Options
const categorySel = document.getElementById('category')
const subCategorySel = document.getElementById('subcategory')
const response = await fetchData('/admin/get-category', 'GET')

const data = await response.json()
const subCategories = {}
for(const obj of data){
    subCategories[obj.category_name] = obj.subCategories
}

//Building category options
for(const category in subCategories){
    const newOption = document.createElement('option')
    newOption.value = category
    newOption.innerText = category
    categorySel.appendChild(newOption)
    if(product.category == category){
        categorySel.selectedIndex = categorySel.options.length - 1;
    } 
}



//Building subcategory options
const buildSubCategory = ()=>{
    subCategorySel.innerHTML = ''
    const cate = categorySel.value
    for(let sub of subCategories[cate]){
        const newOption = document.createElement('option')
        newOption.value = sub.subcategory_name
        newOption.innerText = sub.subcategory_name
        subCategorySel.appendChild(newOption)
        if(product.sub_category == sub.subcategory_name){
            subCategorySel.selectedIndex = subCategorySel.options.length - 1;
        }
    }
}

buildSubCategory()


//Adding onchange Event to Category selector
categorySel.addEventListener('change', buildSubCategory)



//COLOR
let colors = []


const colorContainer = document.getElementById('p_color_container')
const colorInp = document.getElementById('p_color') 
const colorBtn = document.getElementById('color_btn')



colorInp.addEventListener('keypress', (e)=>{
    if (e.key === "Enter") {
        e.preventDefault();
        colorBtn.click();
    }
})

colorBtn.addEventListener('click', ()=>{
    const color = colorInp.value.trim()
    const newColorDiv = document.createElement('div')
    newColorDiv.classList.add('p_color')
   //validating color 
    newColorDiv.style.backgroundColor = color
    const bgColor = newColorDiv.style.backgroundColor
    if(colors.includes(bgColor))return setError(colorInp, "Already added")
    if(bgColor){
        const del = document.createElement('button')
        del.innerText = 'X'
        del.classList.add('btn', 'btn-danger', 'fw-bold')

        del.addEventListener('click', ()=>{//Delete button Event
            colors = colors.filter( col => col != bgColor)
            colorContainer.removeChild(newColorDiv)
        })

        colorInp.value = ''
        setSuccess(colorInp)
        colors.push(bgColor)
        newColorDiv.appendChild(del)
        colorContainer.appendChild(newColorDiv)
    } else setError(colorInp, "Not valid color")
})

//Building previous colors
function rgbToHex(rgbColor) {
    const rgbComponents = rgbColor.match(/\d+/g);
    const hexComponents = rgbComponents.map(component => parseInt(component).toString(16).padStart(2, '0'));
    return '#' + hexComponents.join('');
  }

for(let color of product.colors){
    colorInp.value = rgbToHex(color)
    colorBtn.click()
}




//Size

//building previous sizes
const allCheckbox = document.querySelectorAll('input[type="checkbox"]')

for(let checkbox of allCheckbox){
    if(product.sizes.includes(checkbox.value)){
        checkbox.checked = true
    }
}

const sizeDiv = document.getElementById('p_size')
let sizes = []
function storingSize(){
    sizes = []
    const checkedSize = document.querySelectorAll('input[type="checkbox"]:checked');
    for(let i = 0; i < checkedSize.length; i++){
        sizes.push(checkedSize[i].value)
    }
}


//IMAGES=============

//Performing with Images
const button = document.getElementById('add-btn')
// const form = document.querySelector('form')
const div = document.getElementById('img-preview')
const fileInp = document.getElementById('photo')


let photoCollections_prev = []
let photoCollections_curr = []

//Building previous Images
for(let img of product.product_images){
    const newDiv = document.createElement('div')
    newDiv.classList.add('p-img', 'col-md-2')
    newDiv.innerHTML = `<img src="/public/img/${img}">`
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn', 'btn-danger')
    deleteBtn.innerText = 'X'
    newDiv.appendChild(deleteBtn)
    div.appendChild(newDiv)
    deleteBtn.addEventListener('click', ()=>{
        div.removeChild(newDiv)
        photoCollections_prev = photoCollections_prev.filter(photo => photo != img)
    })
    photoCollections_prev.push(img)
}


fileInp.addEventListener('change', (e)=>{
    const imgFiles = e.target.files
    for(let idx = 0; idx < imgFiles.length; idx++){
        photoCollections_curr.push(imgFiles[idx])
        const imgSrc = URL.createObjectURL(imgFiles[idx])
        const newDiv = document.createElement('div')
        newDiv.classList.add('p-img', 'col-md-2')
        newDiv.innerHTML = `<img src="${imgSrc}">`
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('btn', 'btn-danger')
        deleteBtn.innerText = 'X'
        newDiv.appendChild(deleteBtn)
        div.appendChild(newDiv)
        deleteBtn.addEventListener('click', ()=>{
            div.removeChild(newDiv)
            photoCollections_curr = photoCollections_curr.filter(photo => photo != imgFiles[idx])
        })
    }
})




const p_nameInp = document.getElementById('p_name')
const p_priceInp = document.getElementById('p_price')
const p_stockInp = document.getElementById('p_stock')
const p_desInp = document.getElementById('p_des')


let name, price, stock, des 


//VALIDATION
function validate(){

    name = p_nameInp.value.trim()
    price = p_priceInp.value.trim() 
    stock = p_stockInp.value.trim()
    des = p_desInp.value.trim()

    let allOk = true

    console.log(name)
    if (name == ''){
        setError(p_nameInp, "Name cant be empty")
        allOk = false
    } else if(productsName.includes(name.toLowerCase())){
        setError(p_nameInp, "Product name already exist")
        allOk = false
    } else setSuccess(p_nameInp)

    const pricePattern = /^[1-9][0-9]*$/
    if(pricePattern.test(price)) setSuccess(p_priceInp)
    else {
        setError(p_priceInp, "Provide valid Price")
        allOk = false
    }

    const stockPattern = /^[0-9]+$/
    if(stockPattern.test(stock))setSuccess(p_stockInp)
    else {
        setError(p_stockInp, "Stock should be number")
        allOk = false
    }

    if(des === ''){
        setError(p_desInp, "Description can't be empty.")
        allOk = false
    } else setSuccess(p_desInp)


    if(!photoCollections_curr.length && !photoCollections_prev.length) {
        setError(fileInp, "Please provide at leat one photo")
        allOk = false
    } else setSuccess(fileInp)

    if(!sizes.length){
        allOk = false
        setError(sizeDiv, "Give at least One size")
    } else setSuccess(sizeDiv)

    if(!colors.length){
        allOk = false
        setError(colorInp, "Please provide at least one color")
    } else setSuccess(colorInp)


    return allOk
}




//SAVE CHANGES
button.addEventListener('click', async (e)=>{
    e.preventDefault()
    storingSize()
    if(validate()){
        const formData = new FormData()
        for (let i = 0; i < photoCollections_curr.length; i++) {
           formData.append('photo', photoCollections_curr[i]);
        }
    
        const jsonData = {$set: {}}

        if(name.toLowerCase() != product.product_name.toLowerCase()){
            jsonData.$set.product_name = name
        }

        if(price != product.product_price) jsonData.$set.product_price = price
        if(stock != product.product_stock) jsonData.$set.product_stock = stock
        if(des != product.product_des) jsonData.$set.product_des = des
        if(categorySel.value != product.category) jsonData.$set.category = categorySel.value
        if(subCategorySel.value != product.sub_category) jsonData.$set.sub_category = subCategorySel.value
        if(sizes != product.sizes) jsonData.$set.sizes = sizes
        if(colors != product.colors) jsonData.$set.colors = colors
    
        console.log(JSON.stringify(jsonData))
        formData.append('jsonData', JSON.stringify(jsonData))
    
        const url = `/admin/panel/products/edit/${productId}`
        const response = await fetch(url, {
            method: 'PUT',
            body: formData
        })
        // console.log(jsonData)
        // const response = await fetch(url)
        if(response.ok){
            productsName.push(name)
            photoCollections_prev += [...photoCollections_curr] 
            const msg = document.createElement('p')
            msg.innerHTML = 'updated'
            div.appendChild(msg)
            setTimeout(()=>{
                div.removeChild(msg)
            }, 5000)
            
        } else console.log("err")
    }
    
})



const logout = document.getElementById('logout')
logout.addEventListener('click', async ()=>{
    const res = await fetchData('/admin/logout', 'DELETE')
    if(res.ok) window.location.href = '/admin/login'
})