import fetchData from "../helper/fetchData.js"
import { setSuccess, setError } from "../helper/setError&SetSuccess.js"


const form = document.getElementById('form')
const categoryNameInp = document.getElementById('category_name')
const subCategoryInp = document.getElementById('sub_category_name')
const addButton = document.querySelector('.add')
const subCategoryContainer = document.querySelector('.sub_category_container')
const categoryName = categoryNameInp.value

let subCategories = []

const build = ()=>{
    const subDivs = subCategoryContainer.querySelectorAll('div')
    for(let i = 0; i < subDivs.length; i++){
        const subDiv = subDivs[i]
        subCategories.push(subDiv.querySelector('p').innerText)
    }
}
build()
console.log(subCategories)
form.addEventListener('submit', async(e)=>{
    e.preventDefault()
    if(!subCategories.length) return setError(subCategoryInp, "Provide atleast one subcategory")
    const body = {
        oldCategory_name: categoryName,
        category_name: categoryNameInp.value.trim(),
        subCategories
    }
    const response = await fetchData(
        `/admin/panel/category/edit/${categoryName}`,
        'PUT',
        body)
        
        if(response.status == 400) setError(categoryNameInp, "Category name already exist")
        if(response.ok) {
            setSuccess(categoryNameInp)
            subCategoryContainer.innerHTML = ''
            const msg = document.createElement('p')
            msg.innerHTML = "Category updated"
            subCategoryContainer.appendChild(msg)
        }  
        
})

subCategoryInp.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addButton.click();
        subCategoryInp.value = ''
    }
});
    

addButton.addEventListener('click', ()=>{
    const subCategory = subCategoryInp.value.trim()
    if(!subCategory) return setError(subCategoryInp, "Sub category can't be empty")
    if(!subCategories.includes(subCategory)){
        subCategories.push(subCategory)
        setSuccess(subCategoryInp)
        printSubCategories()
    } else setError(subCategoryInp, "sub category alredy added..?")
})
    

const printSubCategories = ()=>{
    subCategoryContainer.innerHTML = ''
    for(let sub of subCategories){
        
        const subDiv = document.createElement('div')
        const delBtn = document.createElement('button')
        const subName = document.createElement('p')
        
        subName.innerHTML = sub
        delBtn.innerHTML = 'delete'
        
        subDiv.appendChild(delBtn)
        subDiv.appendChild(subName)
        
        delBtn.addEventListener('click', ()=>{
            subCategories = subCategories.filter(sc => sc != sub)
            printSubCategories()
        })
        
        
        subCategoryContainer.appendChild(subDiv)
    }
}

printSubCategories()