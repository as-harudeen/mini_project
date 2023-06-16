import fetchData from "../helper/fetchData.js"
import { setSuccess, setError } from "../helper/setError&SetSuccess.js"


const form = document.getElementById('form')
const categoryNameInp = document.getElementById('category_name')
const subCategoryInp = document.getElementById('sub_category_name')
const addButton = document.querySelector('.add')
const subCategoryContainer = document.querySelector('.sub_category_container')
let categoryName 

let subCategories = []
let oldSubCategories = [] //to compare old one and new one

const buildOldSubCategories = async()=>{
    const res = await fetchData(`/admin/get-category?category_name=${categoryNameInp.value}`, 'GET')
    if(res.ok){
        const data = await res.json()
        oldSubCategories = []
        categoryName = data[0].category_name
        for(let sub of data[0].subCategories){
            oldSubCategories.push(sub.subcategory_name)
        }
    }
}
buildOldSubCategories()

form.addEventListener('submit', async(e)=>{
    e.preventDefault()
    if(!subCategories.length && categoryNameInp.value.trim() === categoryName) return setError(subCategoryInp, "There is no change")

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
            subCategories = []
            subCategoryContainer.innerHTML = ''
            const msg = document.createElement('p')
            msg.innerHTML = "Category updated"
            subCategoryContainer.appendChild(msg)
            setTimeout(()=>{
                subCategoryContainer.removeChild(msg)
            }, 2000)
            buildOldSubCategories()
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
    if(!subCategories.includes(subCategory) && !oldSubCategories.includes(subCategory)){
        subCategories.push(subCategory)
        setSuccess(subCategoryInp)
        printSubCategories()
    } else setError(subCategoryInp, "sub category already added..?")
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