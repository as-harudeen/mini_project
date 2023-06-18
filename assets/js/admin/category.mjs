import fetchData from "../helper/fetchData.js";


const categoriesContiner = document.querySelector('.categories-container');
const logoutBtn = document.getElementById('logout')


function subCatBtnClickHandler(categoryName, subcategoryName, button) {
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
    
    // console.log(data)

    // for(let ctr of data){
    //     const categoryDiv = document.createElement('div')

    //     const categoryTitle = document.createElement('h5')
    //     categoryTitle.innerHTML = ctr.category_name

    //     const editBtn = document.createElement('button')
    //     editBtn.innerHTML = 'edit'

    //     const subCatDiv = document.createElement('div')
    //     for(let sub of ctr.subCategories){
    //         const subCat = document.createElement('div')
    //         const subCatName = document.createElement('h6')
    //         subCatName.innerHTML = sub.subcategory_name

    //         const subCatBtn = document.createElement('button')
    //         sub.isDisabled == true ? subCatBtn.innerHTML = 'list' : subCatBtn.innerHTML = 'unlist'

    //         subCatBtn.addEventListener('click', subCatBtnClickHandler(categoryTitle.innerText, subCatName.innerText, subCatBtn));

    //         subCat.appendChild(subCatName)
    //         subCat.appendChild(subCatBtn)
    //         subCatDiv.appendChild(subCat)
    //     }

        // editBtn.addEventListener('click', ()=>{
        //     window.location.href = `/admin/panel/category/edit/${ctr.category_name}`
        // })


    //     categoryDiv.appendChild(categoryTitle)
    //     categoryDiv.appendChild(editBtn)
    //     categoryDiv.appendChild(subCatDiv)
    //     categoriesContiner.appendChild(categoryDiv)

    //   }









        
        
        const categories = document.getElementById('categories')
        const newDiv = document.createElement('div')
        
        for(let ctr of data){
          const categoryDiv = document.createElement('div')
          categoryDiv.classList.add('mb-4')
        
          categoryDiv.innerHTML = `            <div class="container-fluid py-4 categoryContainer">
          <div class="d-flex justify-content-between">
              <h5 class="d-inline text-light">${ctr.category_name}</h5>
              <div>
                  <button class="btn btn-sm btn-outline-light editBtn">Edit</button>
                  <button class="btn btn-sm btn-outline-light drop-btn"><i class="fa-sharp fa-solid fa-arrow-down"></i></button>
              </div>
          </div>
          <div class="sub-container d-none container-fluid Pa_table bg-white py-4">
              <div class="container-fluid bg-white P-table m-0 px-0">
                  <div class="container-fluid  p-0 d-flex align-items-center justify-content-center">
                      <table class="w-100 tableSize ">
                          <thead class="cartTop" style="position:sticky; top: 0; z-index: 1;">
                              <tr class="cart_table">
                                  <th class="first p-3 px-4">no</th>
                                  <th class="p-3">Name*</th>
                                  <th class="third p-3">list/unlist</th>
                              </tr>
                          </thead>
                      </table>
                  </div>
              </div>
          </div>
        </div>`


        const categoryContainer = categoryDiv.querySelector('.categoryContainer')
        const dropBtn = categoryDiv.querySelector('.drop-btn')
        
        const handleDropButtonClick = () => {
          const subContainer = categoryContainer.querySelector('.sub-container');
          if (subContainer.classList.contains('d-none')) {
            subContainer.classList.remove('d-none');
            dropBtn.querySelector('i').classList.remove('fa-arrow-down');
            dropBtn.querySelector('i').classList.add('fa-arrow-up');
          } else {
            subContainer.classList.add('d-none');
            dropBtn.querySelector('i').classList.add('fa-arrow-down');
            dropBtn.querySelector('i').classList.remove('fa-arrow-up');
          }
        };
        dropBtn.addEventListener('click', handleDropButtonClick)


        const editBtn = categoryContainer.querySelector('.editBtn')
        editBtn.addEventListener('click', ()=>{
          window.location.href = `/admin/panel/category/edit/${ctr.category_name}`
        })

        const table = categoryDiv.querySelector('table')
        const tbody = document.createElement('tbody')
        let no = 1

        for(let sub of ctr.subCategories){
          const tr = document.createElement('tr')
          tr.classList.add('mt-2')
          tr.innerHTML = `
              <td scope="col" class="px-4">
                  <span class="couponListFont">
                      ${no++}
                  </span>
              </td>
              <td scope="col" class="px-4">
                  <span class="couponListFont">
                      ${sub.subcategory_name}
                  </span>
              </td>
              <td scope="col" class="px-4">
                  <button class='disableControlBtn btn btn-sm btn-outline-dark'>${sub.isDisabled ? "list" : "unlist"}</button>
              </td>`

              const disableControlBtn = tr.querySelector('.disableControlBtn')
              disableControlBtn.addEventListener('click', subCatBtnClickHandler(ctr.category_name, sub.subcategory_name, disableControlBtn))
              
              tbody.appendChild(tr)
        }                    

         table.appendChild(tbody)



        
        newDiv.appendChild(categoryDiv)
        }
        
        categories.appendChild(newDiv)
}
fetch()


logoutBtn.addEventListener('click', async()=>{
  const res = await fetchData('/admin/logout', 'DELETE')
  if(res.ok) window.location.href = '/admin/login'
})
















































// const categories = document.getElementById('categories')
// const newDiv = document.createElement('div')

// for(let i = 0; i < 4; i++){
//   const categoryDiv = document.createElement('div')
//   categoryDiv.classList.add('mb-4')

//   categoryDiv.innerHTML = `            <div class="container-fluid py-4 categoryContainer">
//   <div class="d-flex justify-content-between">
//       <h5 class="d-inline text-light">${i} head</h5>
//       <div>
//           <button class="btn btn-sm btn-outline-light">Edit</button>
//           <button class="btn btn-sm btn-outline-light drop-btn"><i class="fa-sharp fa-solid fa-arrow-down"></i></button>
//       </div>
//   </div>
//   <div class="sub-container d-none container-fluid Pa_table bg-white py-4">
//       <div class="container-fluid bg-white P-table m-0 px-0">
//           <div class="container-fluid  p-0 d-flex align-items-center justify-content-center">
//               <table class="w-100 tableSize ">
//                   <thead class="cartTop" style="position:sticky; top: 0; z-index: 1;">
//                       <tr class="cart_table">
//                           <th class="first p-3 px-4">no</th>
//                           <th class="p-3">name</th>
//                           <th class="p-3">opion</th>
//                           <th class="third p-3">options</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       <tr class="mt-2">
//                           <td scope="col" class="px-4">
//                               <span class="couponListFont">
//                                   1
//                               </span>
//                           </td>
//                           <td scope="col" class="px-4">
//                               <span class="couponListFont">
//                                   pants
//                               </span>
//                           </td>
//                           <td scope="col" class="px-4">
//                               <span class="couponListFont">
//                                   tshirt
//                               </span>
//                           </td>
//                       </tr>

                      
//                   </tbody>
//               </table>
//           </div>
//       </div>
//   </div>
// </div>
//   `
// const dropBtn = categoryDiv.querySelector('.drop-btn')
// const categoryContainer = categoryDiv.querySelector('.categoryContainer')

// dropBtn.addEventListener('click', ()=>{
//   console.log("hihdfoahsdfoih;jsa")
//     const subContaier = categoryContainer.querySelector('.sub-container')
//     if(subContaier.classList.contains('d-none')){
//         subContaier.classList.remove('d-none')
//         dropBtn.querySelector('i').classList.remove('fa-arrow-down')
//         dropBtn.querySelector('i').classList.add('fa-arrow-up')
        
//     } else {
//         subContaier.classList.add('d-none')
//         dropBtn.querySelector('i').classList.add('fa-arrow-down')
//         dropBtn.querySelector('i').classList.remove('fa-arrow-up')
//     }
// })


// newDiv.appendChild(categoryDiv)
// }

// categories.appendChild(newDiv)








