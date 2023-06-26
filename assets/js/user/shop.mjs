
import fetchData from '../helper/fetchData.js'


// Get all the category-container elements
const categoryContainers = [...document.getElementsByClassName('category-container')];


// Loop through each category-container element
categoryContainers.forEach(function(container) {
  // Add a click event listener to each category-container element
  container.addEventListener('click', function() {
    // Find the sibling element with the class "sub-category"
    const subCategory = this.nextElementSibling;

    // Toggle the visibility of the sub-category element
    subCategory.classList.toggle('d-none');
  });

  
});






let checkedSubCate = []
const checkBoxes = document.querySelectorAll('.sub-check')

for(let checkbox of checkBoxes){
    console.log(checkbox.value)
    checkbox.addEventListener("change", ()=>{
        if(checkbox.checked) checkedSubCate.push(checkbox.value)
        else {
            checkedSubCate = checkedSubCate.filter(sub => sub != checkbox.value)
        }
        fetchProducts()
    })
}




const sortInp = document.getElementById('sortSelect')

function sortBy (){
    const sortInpVal = sortInp.value
    if(sortInpVal == 'highToLow') return {product_price: -1}
    else if (sortInpVal == 'lowToHigh') return {product_price: 1}
    else if (sortInpVal == 'lastest') return {timestamp: -1}
    return {}
}



const fetchProducts = async ()=>{
    
    let url = 'http://localhost:5000/get-products'
    const sort = sortBy()
    const option = {}
    if(checkedSubCate.length) option.sub_category = {$in: checkedSubCate}


    url += `?option=${JSON.stringify(option)}`//adding option query
    url += `&sort=${JSON.stringify(sort)}` //adding sort query

    const response = await fetchData(url, 'GET')
    const products = await response.json()

    console.log(products)
}

fetchProducts()
