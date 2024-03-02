const bannerTemp = document.getElementById('banner-temp')! as HTMLTemplateElement;
const form = document.getElementById('form')! as HTMLFormElement;
const bannerImgInp = document.getElementById('banner-img-input')! as HTMLInputElement;

form.addEventListener('submit', (e)=> {
    e.preventDefault();
    console.log(bannerImgInp.fil);
})

console.log("from ")