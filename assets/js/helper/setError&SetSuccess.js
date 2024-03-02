const setError = (element, message)=>{

    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.err')

    errorDisplay.innerHTML = message
    inputControl.classList.add('err')
    inputControl.classList.remove('success')
}

const setSuccess = (element)=>{
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.err')

    errorDisplay.innerHTML = ''
    inputControl.classList.add('success')
    inputControl.classList.remove('err')
}

export {setError, setSuccess}