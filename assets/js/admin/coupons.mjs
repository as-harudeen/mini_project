import fetchData from '../helper/fetchData.js'


const removeBtns = document.querySelectorAll('.remove-btn')
const couponsTbody = document.getElementById('coupons-tbody')
const confirmDialog = document.getElementById('confirm-dialog')

confirmDialog.querySelector('.confirm-dialog-head').innerText = 'Remove coupon'
confirmDialog.querySelector('.confirm-dialog-body').innerText = "Do you really want to remove this coupon?"

const confirmBtn = confirmDialog.querySelector('.confirm-btn')
const cancelBtn = confirmDialog.querySelector('.cancel-btn')


let currCoupon

for(let btn of removeBtns){
    btn.addEventListener('click', ()=>{
        currCoupon = btn.parentElement
        confirmDialog.showModal()
    })
}

cancelBtn.addEventListener('click', ()=>{
    confirmDialog.close()
})

confirmBtn.addEventListener('click', async ()=>{
    
    const res = await fetchData(`/admin/panel/coupons/delete/${currCoupon.dataset.id}`, 'PUT')
    if(res.ok){
        currCoupon.innerHTML = "Dleted"
        currCoupon.classList.add('btn', 'btn-danger')
        setTimeout(()=>{
            couponsTbody.removeChild(currCoupon)
        }, 2000)
        confirmDialog.close()
    }
})