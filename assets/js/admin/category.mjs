import fetchData from "../helper/fetchData.js";
import { setSuccess, setError } from "../helper/setError&SetSuccess.js";


const categoriesContiner = document.querySelector('.categories-container');



const fetch =  async ()=>{
    const response = await fetchData('/admin/get-category', 'GET')
    const data = await response.json()
    
    for(let ctr of data){
        const categoryDiv = document.createElement('div')

        const categoryTitle = document.createElement('h5')
        categoryTitle.innerHTML = ctr.category_name

        const editBtn = document.createElement('button')
        editBtn.innerHTML = 'edit'

        const subCatDiv = document.createElement('div')
        for(let sub of ctr.subCategories){
            const subCat = document.createElement('div')
            subCat.innerHTML = sub
            subCatDiv.appendChild(subCat)
        }

        editBtn.addEventListener('click', ()=>{
            window.location.href = `/admin/panel/category/edit?category_name=${ctr.category_name}`
        })


        categoryDiv.appendChild(categoryTitle)
        categoryDiv.appendChild(editBtn)
        categoryDiv.appendChild(subCatDiv)
        categoriesContiner.appendChild(categoryDiv)
    }
}

fetch()

