import fetchData from "../helper/fetchData.js"
import { setSuccess, setError } from "../helper/setError&SetSuccess.js"


const form = document.getElementById('form')
const categoryNameInp = document.getElementById('category_name')
const subCategoryInp = document.getElementById('sub_category_name')

let subCategories = []

form.addEventListener('submit', async(e)=>{
    e.preventDefault()
    if(!subCategories.length) return setError(subCategoryInp, "Provide atleast one subcategory")
    const body = {
        category_name: categoryNameInp.value.trim(),
        subCategories
    }
    const response = await fetchData(
        '/admin/panel/category/add',
        'POST',
        body)
        
        if(response.status == 400) setError(categoryNameInp, "Category name already exist")
        if(response.ok) {
            setSuccess(categoryNameInp)
            previewBody.innerHTML = ''
            categoryNameInp.value = ''
            previewTitle.querySelector('h5').innerHTML = "Category added." 
            subCategories = []
        }  
        
})


const previewTitle = document.getElementById('preview-title')
const previewBody = document.getElementById('preview-body')


categoryNameInp.addEventListener('keyup', ()=>{
    previewTitle.querySelector('h5').innerHTML = categoryNameInp.value.trim()
})


const addBtn = document.querySelector('.addbutton')

addBtn.addEventListener('click', ()=>{
    const subCat = subCategoryInp.value.trim()
    if(!subCat) return setError(subCategoryInp, 'Give Subcategory name')
    if(subCategories.includes(subCat)) return setError(subCategoryInp, "Subcategory exist")

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