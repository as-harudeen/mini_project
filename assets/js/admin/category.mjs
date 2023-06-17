import fetchData from "../helper/fetchData.js";
import { setSuccess, setError } from "../helper/setError&SetSuccess.js";


const categoriesContiner = document.querySelector('.categories-container');
const logoutBtn = document.getElementById('logout')


function createSubCatBtnClickHandler(categoryName, subcategoryName, button) {
    return async function() {
      const body = {
        category_name: categoryName,
        subcategory_name: subcategoryName
      };
  
      console.log(body);
      const query = button.innerHTML === 'list' ? 'enable' : 'disable';
      console.log(query)
      const response = await fetchData(`/admin/${query}`, 'PUT', body);
  
      if (response.ok) {
        button.innerHTML = button.innerHTML === 'list' ? 'unlist' : 'list';
      }
    };
  }



//Building ui
const fetch =  async ()=>{
    categoriesContiner.innerHTML = ''
    const response = await fetchData('/admin/get-category', 'GET')
    // if(response.status === 400) return window.location.href = '/admin/login'
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
            sub.isDisabled == true ? subCatBtn.innerHTML = 'list' : subCatBtn.innerHTML = 'unlist'

            subCatBtn.addEventListener('click', createSubCatBtnClickHandler(categoryTitle.innerText, subCatName.innerText, subCatBtn));

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


logoutBtn.addEventListener('click', async()=>{
  const res = await fetchData('/admin/logout', 'DELETE')
  if(res.ok) window.location.href = '/admin/login'
})