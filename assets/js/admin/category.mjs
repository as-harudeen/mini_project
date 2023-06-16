import fetchData from "../helper/fetchData.js";
import { setSuccess, setError } from "../helper/setError&SetSuccess.js";


const categoriesContiner = document.querySelector('.categories-container');



const fetch =  async ()=>{
    categoriesContiner.innerHTML = ''
    const response = await fetchData('/admin/get-category', 'GET')
    const data = await response.json()
    
    console.log(data)

    for(let ctr of data){
        const categoryDiv = document.createElement('div')

        const categoryTitle = document.createElement('h5')
        categoryTitle.innerHTML = ctr.category_name

        const editBtn = document.createElement('button')
        editBtn.innerHTML = 'edit'

        const subCatDiv = document.createElement('div')
        for(let sub of ctr.subCategories){
            const subCat = document.createElement('div')
            const subCatName = document.createElement('h6')
            subCatName.innerHTML = sub.subcategory_name

            const subCatBtn = document.createElement('button')
            subCatBtn.innerHTML = sub.isDisabled ? 'list' : 'unlist'

            subCatBtn.addEventListener('click', async ()=>{
                const body = {
                    category_name: categoryTitle.innerText,
                    subcategory_name: subCatName.innerText
                }

                console.log(body)
                const query = subCatBtn.innerText === 'list' ? 'disable' : 'enable'
                const response = await fetchData(`/admin/${query}`,
                'PUT', body)

                if(response.ok) subCatBtn.innerHTML === 'list' ? subCatBtn.innerHTML = 'unlist' : subCatBtn.innerHTML = 'list'
            })

            subCat.appendChild(subCatName)
            subCat.appendChild(subCatBtn)
            subCatDiv.appendChild(subCat)
        }

        editBtn.addEventListener('click', ()=>{
            window.location.href = `/admin/panel/category/edit/${ctr.category_name}`
        })


        categoryDiv.appendChild(categoryTitle)
        categoryDiv.appendChild(editBtn)
        categoryDiv.appendChild(subCatDiv)
        categoriesContiner.appendChild(categoryDiv)
    }
}

fetch()
