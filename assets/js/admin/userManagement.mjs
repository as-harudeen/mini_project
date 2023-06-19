import fetchData from "../helper/fetchData.js";

const fetch = async()=>{
    const response = await fetchData('/admin/get-users', 'GET')
    const users = await response.json()


    const tbody = document.querySelector('tbody')

    for(let i = 0; i < users.length; i++){
        const user = users[i]
        const tr = document.createElement('tr')
        tr.innerHTML = `                                                <tr>
        <td class="ps-4">${i+ 1}</td>
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

