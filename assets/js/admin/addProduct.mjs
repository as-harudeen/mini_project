import fetchData from '../helper/fetchData.js'
import {setSuccess, setError} from '../helper/setError&SetSuccess.js'



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
    }
}

buildSubCategory()


//Adding onchange Event to Category selector
categorySel.addEventListener('change', buildSubCategory)






//Performing with Images
const button = document.getElementById('add-btn')
const form = document.querySelector('form')
const div = document.getElementById('img-preview')
const fileInp = document.getElementById('photo')


let photoCollections = []

fileInp.addEventListener('change', (e)=>{
    const imgFiles = e.target.files
    console.log(imgFiles[0])
    for(let idx = 0; idx < imgFiles.length; idx++){
        photoCollections.push(imgFiles[idx])
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
            photoCollections = photoCollections.filter(photo => photo != imgFiles[idx])
        })
    }
    // div.innerHTML = `<img src="${imgSrc}">`
    console.log(photoCollections)
})



button.addEventListener('click', async (e)=>{
    e.preventDefault()
    storingSize()
    if(validate()){
        const formData = new FormData()
        for (let i = 0; i < photoCollections.length; i++) {
           formData.append('photo', photoCollections[i]);
        }
    
        const jsonData = {
            product_name: name,
            product_price: parseInt(price),
            product_stock: parseInt(stock),
            product_des: des,
            category: categorySel.value,
            sub_category: subCategorySel.value,
            sizes,
            colors
        }
    
        formData.append('jsonData', JSON.stringify(jsonData))
    
        const url = '/admin/panel/products/add'
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        })
    
        if(response.ok){
            p_nameInp.value = ''
            p_priceInp.value = ''
            p_stockInp.value = ''
            p_desInp.value = ''
            colors = []
            colorContainer.innerHTML = ''
            productsName.push(name)
            photoCollections = []
            div.innerHTML = ''
            const msg = document.createElement('p')
            msg.innerHTML = 'uploaded'
            div.appendChild(msg)
            setTimeout(()=>{
                div.removeChild(msg)
            }, 5000)
            
        }
    }
    
})


const p_nameInp = document.getElementById('p_name')
const p_priceInp = document.getElementById('p_price')
const p_stockInp = document.getElementById('p_stock')
const p_desInp = document.getElementById('p_des')


let name, price, stock, des 


let productsName = []
const res = await fetchData('/admin/get-products', 'GET')
if(res.ok){
    const dt = await res.json()
    for(let i = 0; i < dt.length; i++){
        productsName.push(dt[i].product_name.toLowerCase())
    }
}
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


    if(!photoCollections.length) {
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





//Performing with COLOR 

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
    if(!color.startsWith('#')) return setError(colorInp, 'Please provide valid hex color')

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



//Size

const sizeDiv = document.getElementById('p_size')
let sizes = []
function storingSize(){
    sizes = []
    const checkedSize = document.querySelectorAll('input[type="checkbox"]:checked');
    for(let i = 0; i < checkedSize.length; i++){
        sizes.push(checkedSize[i].value)
    }
}



const logout = document.getElementById('logout')
logout.addEventListener('click', async ()=>{
    const res = await fetchData('/admin/logout', 'DELETE')
    if(res.ok) window.location.href = '/admin/login'
})