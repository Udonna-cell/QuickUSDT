let firstName = document.querySelector("input#first-name");
let lastName = document.querySelector("input#last-name");
let username = document.querySelector("input#username");
let email = document.querySelector("input#email");
let password = document.querySelector("input#password");
let confirmPassword = document.querySelector("input#confirm-password");
const form = document.querySelector("form")
// confirmation variables
let isPasswordVisible = false


form.addEventListener("submit", (event)=>{
    // check if the passwords are the same
    let passwordState = password.value == confirmPassword.value
    if(passwordState){
        return true
    }
    event.preventDefault()
    password.value = ""
    confirmPassword.value = ""
    alert("password confirmation didn't match the password :(")
})

function hideShow() {
    if (!isPasswordVisible) {
        password.type = "text"
        document.querySelector(".eye").classList.add("active")
        isPasswordVisible =true
    } else {
        password.type = "password"
        document.querySelector(".eye").classList.remove("active")
        isPasswordVisible = false
    }
}