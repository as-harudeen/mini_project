import fetchData from "../helper/fetchData.js";
import { setSuccess, setError } from "../helper/setError&SetSuccess.js";



const userscontainer = document.querySelector('.users-container')



const fetch = async()=>{
    const response = await fetchData('/admin/get-users', 'GET')
    const users = await response.json()

    for(let user of users){
        const userContainer = document.createElement('div')
        const username = document.createElement('h6')
        const userBtn = document.createElement('button')
        username.innerText = user.username
        userBtn.innerText = user.isBlock ? 'unblock' : 'block'

        userBtn.addEventListener('click', async() => {
            const query = userBtn.innerText === 'block' ? 'block' : 'unblock'

            const res = await fetchData(`/admin/${query}/${user._id}`, 'PUT')
            if(res.ok){
                console.log(query)
                userBtn.innerText == 'block' ? userBtn.innerText = 'unblock' : userBtn.innerText = 'block'
            }
        })

        userContainer.appendChild(username)
        userContainer.appendChild(userBtn)
        userscontainer.appendChild(userContainer)
    }
}

fetch()