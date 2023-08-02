import fetchData from "../helper/fetchData.js";

const limit = 3




//pagenation
const pagenation = document.querySelector('.pagenation')
let pagenationBtns

const pagenationBtnEventHandler = ()=>{
    pagenationBtns = pagenation.querySelectorAll('.page-btn')
    for(let btn of pagenationBtns){
        btn.addEventListener('click', ()=>{
            const prevBtn = pagenation.querySelector('.btn-outline-dark')
            prevBtn.classList.remove('btn-outline-dark')
            btn.classList.add('btn-outline-dark')

            const prev_btn = pagenation.querySelector('#prev-btn')
            const next_btn = pagenation.querySelector('#next-btn')
            // const btnNum = 

            if(btn.innerText == 1) prev_btn.disabled = true
            else prev_btn.disabled = false
            if(btn.innerText == pagenationBtns.length) next_btn.disabled = true
            else next_btn.disabled = false
            fetch(+btn.innerText)
        })
    }
}





//SEARCH
const searchInp = document.getElementById('search')
let searchInpVal = ''

const searchInpEventHandler = async ()=>{

    searchInpVal = searchInp.value.trim()
    const option = {
        username: {$regex: `^${searchInpVal}`}
    }

    
    /*doc_count/:collection   here we need users document count*/
    console.log("hhi");
    const res = await fetchData(`/doc_count/users?option=${JSON.stringify(option)}`, 'GET')
    console.log(res)
    const count = await res.text()
    // console.log(count);
    if(!count){
        fetch()
        pagenation.innerHTML = ''
    } 
    else {
        //adding first page button (selected)
        pagenation.innerHTML = `
        <button id="prev-btn" class="btn btn-dark" disabled>Prev</button>
        <button class="btn page-btn btn-outline-dark">1</button>
        `
        //adding rest of pages button
        for(let n = 1; n < Math.ceil(count / limit); n++){
            pagenation.innerHTML += `<button class="btn page-btn">${n + 1}</button>`
        }

        pagenation.innerHTML += '<button id="next-btn" class="btn btn-dark">Next</button>'
    
        fetch()
        pagenationBtnEventHandler()
        pagenation.querySelector('#prev-btn').addEventListener('click', ()=>{
            const currBtn = pagenation.querySelector('.btn-outline-dark').innerText
            pagenationBtns[+currBtn - 2].click()
        })

        pagenation.querySelector('#next-btn').addEventListener('click', ()=>{
            const currBtn = pagenation.querySelector('.btn-outline-dark').innerText
            pagenationBtns[+currBtn].click()
        })
    }
}
searchInpEventHandler() //To build pagenation buttons

let typingTimer
searchInp.addEventListener('keyup', ()=>{
    clearTimeout(typingTimer)

    typingTimer = setTimeout(searchInpEventHandler, 1000)
})






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
                opBtn.innerText == 'block' ? opBtn.innerText = 'unblock' : opBtn.innerText = 'block'
            }
        })
    
        tbody.appendChild(tr)
    }
}

fetch()



const logout = document.getElementById('logout')
logout.addEventListener('click', async ()=>{
    const res = await fetchData('/admin/logout', 'DELETE')
    if(res.ok) window.location.href = '/admin/login'
})