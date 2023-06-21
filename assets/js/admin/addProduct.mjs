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
        newDiv.classList.add('product-img', 'col-md-2')
        // newDiv.style.background = `url("${imgSrc}")`
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
    if(validate()){
        const formData = new FormData()
        for (let i = 0; i < photoCollections.length; i++) {
           formData.append('photo', photoCollections[i]);
        }
    
        const jsonData = {
            product_name: p_nameInp.value.trim(),
            product_price: parseInt(p_priceInp.value.trim()),
            product_stock: parseInt(p_stockInp.value.trim()),
            product_des: p_desInp.value.trim(),
            category: categorySel.value,
            sub_category: subCategorySel.value
        }
    
        formData.append('jsonData', JSON.stringify(jsonData))
    
        const url = '/admin/panel/products/add'
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        })
    
        if(response.ok){
            const fileName = await response.text()
            console.log(fileName)
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
let productsName = []
const res = await fetchData('/admin/get-products', 'GET')
if(res.ok){
    const dt = await res.json()
    for(let i = 0; i < dt.length; i++){
        productsName.push(dt[i].product_name)
    }
}
//VALIDATION
function validate(){
    let allOk = true
    if(productsName.includes(/p_nameInp.value.trim()/i)){
        setError(p_nameInp, "Product name already exist")
        allOk = false
    } else setSuccess(p_nameInp)

    const price = p_priceInp.value.trim() 
    const pricePattern = /^[1-9][0-9]*$/
    console.log(pricePattern.test(price))
    if(pricePattern.te)
    if(typeof  price != 'number'){
        setError(p_priceInp, "Price should be number")
        allOk = false
    } else if(price <= 0){
        setError(p_priceInp, "Price should be more than zero")
    } else setSuccess(p_stockInp)


    const stock = parseInt(p_stockInp.value.trim()) 
    if(typeof  stock != Number){
        setError(p_stockInp, "Price should be number")
        allOk = false
    } else if(stock < 0){
        setError(p_stockInp, "Price can't be negative")
    } else setSuccess(p_stockInp)

    return allOk
}

