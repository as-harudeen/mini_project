//HTML Elements
const selectContainer = document.getElementById('select_container')! as HTMLDivElement;
const basedOnSelector = document.getElementById('based_on')! as HTMLSelectElement;
const getButton = document.getElementById('get_btn')! as HTMLButtonElement;
const tbody = document.querySelector('tbody')!;
const orderRow = document.getElementById('order-row')! as HTMLTemplateElement;
const noData = (document.getElementById('noData')! as HTMLTemplateElement).innerHTML;
const downloadButton = document.getElementById('download-btn')! as HTMLButtonElement;


//Date's container
const dayContainer = selectContainer.querySelector('.day_container')! as HTMLDivElement;
const yearContainer = selectContainer.querySelector('.year_container')! as HTMLDivElement;
const weekContainer = selectContainer.querySelector('.week_container')! as HTMLDivElement;
const monthContainer = selectContainer.querySelector('.month_container')! as HTMLDivElement;
//Date selectors
const daySelector = document.getElementById('day_selector')! as HTMLSelectElement;
const weekSelector = document.getElementById('week_selector')! as HTMLSelectElement;
const monthSelector = document.getElementById('month_selector')! as HTMLSelectElement;
const yearSelector = document.getElementById('year_selector')! as HTMLSelectElement;
//inputs of the Date selectors
const dayInput = document.getElementById('day_input')! as HTMLInputElement;
const weekInput = document.getElementById('week_input')! as HTMLInputElement;
const monthInput = document.getElementById('month_input')! as HTMLInputElement;
const yearInput = document.getElementById('year_input')! as HTMLInputElement;




let selectedBasedOn: string = basedOnSelector.value;
basedOnSelector.addEventListener('change', ()=>{
    selectedBasedOn = basedOnSelector.value;
    buildDateSelectors();
})


function buildDateSelectors (){//Displaying dates selectors based on "baseOnSelector"
    if(selectedBasedOn == 'year'){
        monthContainer.classList.add('d-none');
        weekContainer.classList.add('d-none');
        dayContainer.classList.add('d-none');
    } else {
        monthContainer.classList.remove('d-none');
        if(selectedBasedOn == 'week' || selectedBasedOn == 'day'){
            weekContainer.classList.remove('d-none');
            if(selectedBasedOn == 'day') {
                weekContainer.classList.add('d-none');
                dayContainer.classList.remove('d-none');
                buildDaySelectors()
            } else {
                dayContainer.classList.add('d-none');
                buildAvailableWeek();
            }
        } else {
            weekContainer.classList.add('d-none');
            dayContainer.classList.add('d-none');
        } 

    }
}



function buildDaySelectors (){
    const daysInMonth = new Date(+selectedYear, +selectedMonth, 0).getDate();

    console.log(daysInMonth);
    daySelector.innerHTML = ''
    for(let i = 1; i <= daysInMonth; i++){
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i.toString();
        daySelector.appendChild(option);
    }
}



(function buildAvailableYear (){
    const end = new Date().getFullYear();
    for(let i = 2023; i <= end; i++){
        const option = document.createElement('option');
        const year = i.toString()
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    }
})()

function buildAvailableWeek (){
   
    const month = +selectedMonth;
    const year = +selectedYear;


    weekSelector.innerHTML = '';
    const weekCount = Math.ceil(new Date(year, month, 0).getDate() / 7);
    for(let i = 1; i <= weekCount; i++){
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i.toString();
        weekSelector.appendChild(option);
    }
}


//* DATES EVENTS

let selectedWeek = weekInput.value;
let selectedMonth = monthInput.value;
let selectedYear = yearInput.value;
let selectedDay = dayInput.value;


weekSelector.addEventListener('change', ()=>{
    selectedWeek = weekSelector.value;
    weekInput.value = selectedWeek;
})

monthSelector.addEventListener('change', ()=>{
    selectedMonth = monthSelector.value;
    monthInput.value = selectedMonth;
    if(selectedBasedOn == 'day') buildDaySelectors()
    else if (selectedBasedOn == 'week') buildAvailableWeek()
})


yearSelector.addEventListener('change', ()=>{
    selectedYear = yearSelector.value;
    yearInput.value = selectedYear;
})

daySelector.addEventListener('change', ()=>{
    selectedDay = daySelector.value;
    dayInput.value = selectedDay;
})


//for initial build
buildDateSelectors();



interface Body {
    year: string;
    month?: string;
    week?: string;
    day?: string;
}


//* Geting sales report data

getButton.addEventListener('click', async ()=>{
    console.log(selectedBasedOn);
    const body: Body = {year: selectedYear} as Body;
    if(selectedBasedOn == 'week'){
        body.month = selectedMonth;
        body.week = selectedWeek;
    } else if (selectedBasedOn == 'month'){
        body.month = selectedMonth;
    } else if (selectedBasedOn == 'day'){
        body.month = selectedMonth;
        body.day = selectedDay;
    }

    const res = await fetch (`/admin/orderdetails/${selectedBasedOn}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })

    if(res.ok){
        const data = await res.json();
        builSalesReport(data);
    }
})

interface SubOrders {
    quantity: number;
    total_price: number;
    offer_price: number;
    product_name: string;
    _id: string;
}

interface Order {
    payment_method: string;
    username: string;
    createdAt: string;
    sub_orders: SubOrders[];
}

let haveDNoneClass = false;

//build order Details
function builSalesReport (data: Order[]): void {
    tbody.innerHTML = '';
    if(!data.length) {
        tbody.innerHTML = noData;
        downloadButton.classList.add("d-none");
        haveDNoneClass = true;
        return;
    }
    if(haveDNoneClass) {
        downloadButton.classList.remove("d-none");
        haveDNoneClass = false;
    }
    for(const order of data){
        for(const sub of order.sub_orders){
            const tr = orderRow.content.cloneNode(true)! as HTMLTableRowElement;
            const orderID = tr.querySelector('.order_id')! as HTMLTableCellElement;
            const productName = tr.querySelector('.product_name')! as HTMLTableCellElement;
            const user = tr.querySelector('.user')! as HTMLTableCellElement;
            const totalPrice = tr.querySelector('.total_price')! as HTMLTableCellElement;
            const orderDate = tr.querySelector('.order_date')! as HTMLTableCellElement;
            const quantity = tr.querySelector('.quantity')! as HTMLTableCellElement;
            const remainPayment = tr.querySelector('.pending_payment')! as HTMLTableCellElement;

            orderID.innerText = sub._id;
            productName.innerText = sub.product_name;
            quantity.innerText = sub.quantity.toString();
            user.innerText = order.username;
            const date = new Date(order.createdAt);
            orderDate.innerText = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            totalPrice.innerText = sub.total_price.toString();
            remainPayment.innerText = (sub.total_price - sub.offer_price).toString();

            tbody.appendChild(tr);
        }
    }
}



//* To geting current month sales report as default 
const now = new Date();

const month = (now.getMonth() + 1).toString();
console.log(`⭐ ${month}`);
const year = now.getFullYear().toString();
console.log(`⚡ ${year}`);

for(const option of yearSelector.options){
    if(option.value === year){
        option.selected = true;
        selectedYear = year;
        yearInput.value = year;
        break;
    }
}

for(const option of monthSelector){
    console.log(option.value);
    if(option.value === month) {
        option.selected = true;
        selectedMonth = month;
        monthInput.value = month;
        break;
    }
}

getButton.click();