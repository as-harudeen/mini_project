import fetchData from "../helper/fetchData.js";

const limit = 3




//pagenation
const pagenation = document.querySelector('.pagenation')

const pagenationBtnEventHandler = ()=>{
    const pagenationBtns = pagenation.querySelectorAll('.page-btn')
    for(let btn of pagenationBtns){
        btn.addEventListener('click', ()=>{
            const prevBtn = pagenation.querySelector('.btn-outline-dark')
            prevBtn.classList.remove('btn-outline-dark')
            btn.classList.add('btn-outline-dark')
            fetch(+btn.innerText)
        })
    }
}
pagenationBtnEventHandler()


//SEARCH
const searchInp = document.getElementById('search')
let searchInpVal = ''

const searchInpEventHandler = async ()=>{

    searchInpVal = searchInp.value.trim()
    const option = {
        username: {$regex: `^${searchInpVal}`}
    }


    /*api/doc_count/:collection   here we need users document count*/
    const res = await fetchData(`/api/doc_count/users?option=${JSON.stringify(option)}`, 'GET')
    const count = await res.json()

    if(!count) pagenation.innerHTML = ''
    else {
        //adding first page button (selected)
        pagenation.innerHTML = `
        <button class="btn page-btn btn-outline-dark">1</button>
        `
        //adding rest of pages button
        for(let n = 1; n < Math.ceil(count / limit); n++){
            pagenation.innerHTML += `<button class="btn page-btn">${n + 1}</button>`
        }
    
        fetch()
        pagenationBtnEventHandler()
    }
}
searchInpEventHandler() //To build pagenation buttons

searchInp.addEventListener('input', searchInpEventHandler)








const fetch = async(page = 1)=>{
    
    let url = `/admin/get-users?page=${page}&limit=${limit}`
    if(searchInpVal) {
        const query = {}
        query.username = {$regex: `^${searchInpVal}`}
        url += `&query=${JSON.stringify(query)}`
    }
    const response = await fetchData(url, 'GET')
    const users = await response.json()


    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    for(let i = 0; i < users.length; i++){
        const user = users[i]
        const tr = document.createElement('tr')
        tr.innerHTML = `   <tr>
        <td class="ps-4">${i+ ((page - 1) * 3) + 1}</td>
        <td class="ps-4">${user.username}</td>
        <td class="ps-4">active</td>
        <td class="ps-4"><button class='btn btn-sm btn-outline-dark'>${user.isBlocked ? 'unblock' : 'block'}</button></td>
    </tr>`
    
        const opBtn = tr.querySelector('button')
        opBtn.addEventListener('click', async() => {
            const query = opBtn.innerText === 'block' ? 'block' : 'unblock'
    
            const res = await fetchData(`/admin/${query}/${user._id}`, 'PUT')
            if(res.ok){
                console.log(query)
                opBtn.innerText == 'block' ? opBtn.innerText = 'unblock' : opBtn.innerText = 'block'
            }
        })
    
        tbody.appendChild(tr)
    }
}

fetch()