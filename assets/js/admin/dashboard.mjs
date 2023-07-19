const timeFrames = {
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  month: ['1-5', '6-10', '11-15', '16-20', '21-25', '25+']
};




   const ctx = document.getElementById('myChart').getContext('2d');

   const createGraph = (timeFrames, data_one, data_two, data_three)=>{
     new Chart(ctx, {
         type: 'line',
         data: {
           labels: timeFrames,
           datasets: [{ 
               data: data_one,
               label: "Total order",
               borderColor: "rgb(62,149,205)",
               backgroundColor: "rgb(62,149,205,0.1)",}
            //  }, { 
            //    data: data_two,
            //    label: "Payment pending",
            //    borderColor: "rgb(60,186,159)",
            //    backgroundColor: "rgb(60,186,159,0.1)",
            //  },{ 
            //    data: data_three,
            //    label: "Return/Cancel Request",
            //    borderColor: "rgb(196,88,80)",
            //    backgroundColor:"rgb(196,88,80,0.1)",
            //  }
           ]
         },
       });
   }

   const data_one = [86,114,106,106,107,111,133];
   const data_two = [70,90,44,60,83,90,100];
   const data_three = [6,3,2,2,7,0,16];

  //  createGraph(timeFrames.lastMonthRanges, data_one, data_two, data_three)



const based_on_selector = document.getElementById('based_on');
let selected_based_on = based_on_selector.value

based_on_selector.addEventListener('change', ()=>{
  selected_based_on = based_on_selector.value
  rebuildGraph()
})

import fetchData from '../helper/fetchData.js'

async function rebuildGraph(){
  const res = await fetchData(`/admin/getSalesdata/${selected_based_on}`)
  if(res.ok){
    const data = await res.json()
    createGraph(timeFrames[`${selected_based_on}`], data, data_two, data_three)
  }
}

rebuildGraph()
