"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//HTML Elements
const selectContainer = document.getElementById('select_container');
const basedOnSelector = document.getElementById('based_on');
const getButton = document.getElementById('get_btn');
const tbody = document.querySelector('tbody');
const orderRow = document.getElementById('order-row');
const noData = document.getElementById('noData').innerHTML;
const downloadButton = document.getElementById('download-btn');
//Date's container
const dayContainer = selectContainer.querySelector('.day_container');
const yearContainer = selectContainer.querySelector('.year_container');
const weekContainer = selectContainer.querySelector('.week_container');
const monthContainer = selectContainer.querySelector('.month_container');
//Date selectors
const daySelector = document.getElementById('day_selector');
const weekSelector = document.getElementById('week_selector');
const monthSelector = document.getElementById('month_selector');
const yearSelector = document.getElementById('year_selector');
//inputs of the Date selectors
const dayInput = document.getElementById('day_input');
const weekInput = document.getElementById('week_input');
const monthInput = document.getElementById('month_input');
const yearInput = document.getElementById('year_input');
let selectedBasedOn = basedOnSelector.value;
basedOnSelector.addEventListener('change', () => {
    selectedBasedOn = basedOnSelector.value;
    buildDateSelectors();
});
function buildDateSelectors() {
    if (selectedBasedOn == 'year') {
        monthContainer.classList.add('d-none');
        weekContainer.classList.add('d-none');
        dayContainer.classList.add('d-none');
    }
    else {
        monthContainer.classList.remove('d-none');
        if (selectedBasedOn == 'week' || selectedBasedOn == 'day') {
            weekContainer.classList.remove('d-none');
            if (selectedBasedOn == 'day') {
                weekContainer.classList.add('d-none');
                dayContainer.classList.remove('d-none');
                buildDaySelectors();
            }
            else {
                dayContainer.classList.add('d-none');
                buildAvailableWeek();
            }
        }
        else {
            weekContainer.classList.add('d-none');
            dayContainer.classList.add('d-none');
        }
    }
}
function buildDaySelectors() {
    const daysInMonth = new Date(+selectedYear, +selectedMonth, 0).getDate();
    console.log(daysInMonth);
    daySelector.innerHTML = '';
    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i.toString();
        daySelector.appendChild(option);
    }
}
(function buildAvailableYear() {
    const end = new Date().getFullYear();
    for (let i = 2023; i <= end; i++) {
        const option = document.createElement('option');
        const year = i.toString();
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    }
})();
function buildAvailableWeek() {
    const month = +selectedMonth;
    const year = +selectedYear;
    weekSelector.innerHTML = '';
    const weekCount = Math.ceil(new Date(year, month, 0).getDate() / 7);
    for (let i = 1; i <= weekCount; i++) {
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
weekSelector.addEventListener('change', () => {
    selectedWeek = weekSelector.value;
    weekInput.value = selectedWeek;
});
monthSelector.addEventListener('change', () => {
    selectedMonth = monthSelector.value;
    monthInput.value = selectedMonth;
    if (selectedBasedOn == 'day')
        buildDaySelectors();
    else if (selectedBasedOn == 'week')
        buildAvailableWeek();
});
yearSelector.addEventListener('change', () => {
    selectedYear = yearSelector.value;
    yearInput.value = selectedYear;
});
daySelector.addEventListener('change', () => {
    selectedDay = daySelector.value;
    dayInput.value = selectedDay;
});
//for initial build
buildDateSelectors();
//* Geting sales report data
getButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(selectedBasedOn);
    const body = { year: selectedYear };
    if (selectedBasedOn == 'week') {
        body.month = selectedMonth;
        body.week = selectedWeek;
    }
    else if (selectedBasedOn == 'month') {
        body.month = selectedMonth;
    }
    else if (selectedBasedOn == 'day') {
        body.month = selectedMonth;
        body.day = selectedDay;
    }
    const res = yield fetch(`/admin/orderdetails/${selectedBasedOn}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    if (res.ok) {
        const data = yield res.json();
        builSalesReport(data);
    }
}));
let haveDNoneClass = false;
//build order Details
function builSalesReport(data) {
    tbody.innerHTML = '';
    if (!data.length) {
        tbody.innerHTML = noData;
        downloadButton.classList.add("d-none");
        haveDNoneClass = true;
        return;
    }
    if (haveDNoneClass) {
        downloadButton.classList.remove("d-none");
        haveDNoneClass = false;
    }
    for (const order of data) {
        for (const sub of order.sub_orders) {
            const tr = orderRow.content.cloneNode(true);
            const orderID = tr.querySelector('.order_id');
            const productName = tr.querySelector('.product_name');
            const user = tr.querySelector('.user');
            const totalPrice = tr.querySelector('.total_price');
            const orderDate = tr.querySelector('.order_date');
            const quantity = tr.querySelector('.quantity');
            const remainPayment = tr.querySelector('.pending_payment');
            orderID.innerText = sub._id;
            productName.innerText = sub.product_name;
            quantity.innerText = sub.quantity.toString();
            user.innerText = order.username;
            const date = new Date(order.createdAt);
            orderDate.innerText = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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
for (const option of yearSelector.options) {
    if (option.value === year) {
        option.selected = true;
        selectedYear = year;
        yearInput.value = year;
        break;
    }
}
for (const option of monthSelector) {
    console.log(option.value);
    if (option.value === month) {
        option.selected = true;
        selectedMonth = month;
        monthInput.value = month;
        break;
    }
}
getButton.click();
