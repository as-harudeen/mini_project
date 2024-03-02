import fetchData from "../helper/fetchData.js";


const categoriesContiner = document.querySelector('.categories-container');
const searchInp = document.getElementById('search');
const categories = document.getElementById('categories');



function subCatBtnClickHandler(categoryName, subcategoryName, button) {
  return async function () {
    const body = {
      category_name: categoryName,
      subcategory_name: subcategoryName
    };

    const query = button.innerHTML === 'list' ? 'enable' : 'disable';
    const response = await fetchData(`/admin/${query}`, 'PUT', body);

    if (response.ok) {
      button.innerHTML = button.innerHTML === 'list' ? 'unlist' : 'list';
    }
  };
}

function noData() {
  categories.innerHTML = `
    <div class="d-flex justify-content-center align-items-center mx-auto p-2 mt-3">
    <div class="mx-2  bg-white d-flex flex-column align-items-center justify-content-center p-2 px-4 py-4"
    style="border-radius: 14px; box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);">
    <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_3VDN1k.json" background="transparent"
    speed="5" style="width: 300px; height: 300px; opacity: 80%;" loop autoplay></lottie-player>
    <div class="d-flex flex-column align-items-center justify-content-center " style="color: #9e9e9e;">
        <h5>No Data</h5>
    </div>
</div>`
}





//Building ui
const fetch = async () => {
  let url = '/admin/get-category'
  if (searchInp.value.trim()) {
    let option = { category_name: { $regex: `^${searchInp.value.trim()}`, $options: 'i' } }

    url += `?option=${JSON.stringify(option)}`
  }

  const response = await fetchData(url, 'GET')
  const data = await response.json()

  const newDiv = document.createElement('div')

  categories.innerHTML = '';
  if(!data.length) return noData();

  for (let ctr of data) {
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
    editBtn.addEventListener('click', () => {
      window.location.href = `/admin/panel/category/edit/${ctr.category_name}`
    })

    const table = categoryDiv.querySelector('table')
    const tbody = document.createElement('tbody')
    let no = 1

    for (let sub of ctr.subCategories) {
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





let typeTimer
searchInp.addEventListener("keyup", () => {
  clearTimeout(typeTimer)

  typeTimer = setTimeout(fetch, 1000)
})


const logout = document.getElementById('logout')
logout.addEventListener('click', async () => {
  const res = await fetchData('/admin/logout', 'DELETE')
  if (res.ok) window.location.href = '/admin/login'
})