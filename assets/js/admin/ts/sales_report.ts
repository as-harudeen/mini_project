//HTML Elements
const selectContainer = document.getElementById('select_container')! as HTMLDivElement;
const basedOnSelector = document.getElementById('based_on')! as HTMLSelectElement;


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
    } else {
        monthContainer.classList.remove('d-none');
        if(selectedBasedOn == 'week' || selectedBasedOn == 'day'){
            weekContainer.classList.remove('d-none');
            if(selectedBasedOn == 'day') {
                weekContainer.classList.add('d-none');
                dayContainer.classList.remove('d-none');
                buildDaySelectors()
            } else dayContainer.classList.add('d-none');
        } else {
            weekContainer.classList.add('d-none');
        } 

    }
}
//for initial build
buildDateSelectors();


function buildDaySelectors (){
    console.log( selectedYear,  +selectedMonth)
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



function buildAvailableYear (){
    const end = new Date().getFullYear() - 2023;
    for(let i = 0; i <= end; i++){

    }
}

buildAvailableYear()



//DATES EVENTS
let selectedWeek = weekInput.value;
let selectedMonth = monthInput.value;
let selectedYear = yearInput.value;


weekSelector.addEventListener('change', ()=>{
    selectedWeek = weekSelector.value;
    weekInput.value = selectedWeek;
})

monthSelector.addEventListener('change', ()=>{
    selectedMonth = monthSelector.value;
    monthInput.value = selectedMonth;
    if(selectedBasedOn == 'day') buildDaySelectors()
})


yearSelector.addEventListener('change', ()=>{
    selectedYear = yearSelector.value;
    yearInput.value = selectedYear;
})




