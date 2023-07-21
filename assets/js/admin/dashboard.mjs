const timeFrames = {
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  month: ['1-5', '6-10', '11-15', '16-20', '21-25', '25+']
};




   const ctx = document.getElementById('myChart').getContext('2d');

   const createGraph = (timeFrames, data_one, data_two)=>{
     new Chart(ctx, {
         type: 'line',
         data: {
           labels: timeFrames,
           datasets: [{ 
               data: data_one,
               label: "Total order",
               borderColor: "rgb(62,149,205)",
               backgroundColor: "rgb(62,149,205,0.1)",
           },{
               data: data_two,
               label: "Cash On Delivery",
               borderColor: "rgb(196,88,80)",
               backgroundColor:"rgb(196,88,80,0.1)",
             }
           ]
         },
       });
   }


const based_on_selector = document.getElementById('based_on');
let selected_based_on = based_on_selector.value

based_on_selector.addEventListener('change', ()=>{
  selected_based_on = based_on_selector.value
  rebuildGraph()
})

import fetchData from '../helper/fetchData.js'

async function rebuildGraph(){
  const res = await fetchData(`/admin/orderdata/${selected_based_on}`)
  if(res.ok){
    const data = await res.json()
    createGraph(timeFrames[`${selected_based_on}`], data[0], data[1]);
  }
}

rebuildGraph()
