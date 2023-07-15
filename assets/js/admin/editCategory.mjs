import fetchData from "../helper/fetchData.js"
import { setSuccess, setError } from "../helper/setError&SetSuccess.js"


const form = document.getElementById('form')
const categoryNameInp = document.getElementById('category_name')
const subCategoryInp = document.getElementById('sub_category_name')
const subCategoryContainer = document.querySelector('.sub_category_container')
const previewTitle = document.getElementById('preview-title')
const previewBody = document.getElementById('preview-body')
let categoryName = '' 
let oldCategoriesLength

let subCategories = []
let oldSubCategories = []

const path = window.location.pathname;
let reversCatName = ''
for(let i = path.length - 1; i > 0; i--){
    if(path[i] === '/') break
    reversCatName += path[i]
}
for(let i = reversCatName.length - 1; i >= 0; i--){
    categoryName += reversCatName[i]
}

previewTitle.querySelector('h5').innerHTML = categoryName
categoryNameInp.value = categoryName

const buildOldSubCategories = async()=>{
    const res = await fetchData(`/admin/get-category?category_name=${categoryNameInp.value}`, 'GET')
    if(res.ok){
        const data = await res.json()
        for(let sub of data[0].subCategories){
            oldSubCategories.push(sub.subcategory_name)
        }
        oldCategoriesLength = subCategories.length
    }
}
buildOldSubCategories()

form.addEventListener('submit', async(e)=>{
    e.preventDefault()
    if(subCategories.length === oldCategoriesLength && categoryNameInp.value.trim() === categoryName) return setError(subCategoryInp, "There is no change")

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
            setSuccess(subCategoryInp)
            oldSubCategories.push(...subCategories)
            subCategories = []
            previewBody.innerHTML = ''
            subCategoryInp.value = ''
            previewTitle.querySelector('h5').innerHTML = 'Category updated'
        }  
        
})

       


categoryNameInp.addEventListener('keyup', ()=>{
    previewTitle.querySelector('h5').innerHTML = categoryNameInp.value.trim()
})


const addBtn = document.querySelector('.addbutton')

addBtn.addEventListener('click', ()=>{
    const subCat = subCategoryInp.value.trim()
    if(!subCat) return setError(subCategoryInp, 'Give Subcategory name')
    if(oldSubCategories.includes(subCat)) return setError(subCategoryInp, "Subcategory exist")
    if(subCategories.includes(subCat)) return setError(subCategoryInp, "Subcategory already added")

    subCategories.push(subCat)

    const subDiv = document.createElement('div')


    subDiv.innerHTML = `
        <div class="d-flex justify-content-between">
          <p>${subCat}</p>
          <button class="btn">Delete</button>
        </div>  
    `
    const delBtn = subDiv.querySelector('button')

    delBtn.addEventListener('click', ()=>{
        subCategories = subCategories.filter(sub => sub != subCat )
        previewBody.removeChild(subDiv)
    })

    previewBody.appendChild(subDiv)

})


subCategoryInp.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addBtn.click();
        subCategoryInp.value = ''
    }
});





const logout = document.getElementById('logout')
logout.addEventListener('click', async ()=>{
    const res = await fetchData('/admin/logout', 'DELETE')
    if(res.ok) window.location.href = '/admin/login'
})