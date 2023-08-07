"use strict";
const bannerTemp = document.getElementById('banner-temp');
const form = document.getElementById('form');
const bannerImgInp = document.getElementById('banner-img-input');
const bannerContainer = document.getElementById('banner_container');


const buildBanners = (data) => {
    bannerContainer.innerHTML = '';
    for(const banner of data) {
        const bannerDiv = bannerTemp.content.cloneNode(true);
        bannerDiv.querySelector('.bannerImage').src += banner.banner_url;
        bannerDiv.querySelector('.banner-del').addEventListener('click', async ()=> {
            const res = await fetch(`/admin/panel/banner/delete/${banner._id}`, {method: 'GET'})
            if(res.ok) fetchBanners();
            else console.log("Err");
        })
        bannerContainer.appendChild(bannerDiv);
    }
}


const fetchBanners = async () => {
    const res = await fetch('/admin/getbanners', {
        method: 'GET'
    })
    if(res.ok) {
        const data = await res.json()
        buildBanners(data);
    }
}

fetchBanners();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const img = bannerImgInp.files[0].name;
    const res = await fetch ('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({img})
    })
    if(res.ok) {
        console.log("Added");
        fetchBanners();
    } else console.log('error');
});


