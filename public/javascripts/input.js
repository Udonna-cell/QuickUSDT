
// form actions 
const INPUT = document.querySelectorAll(".Input > input")
const INPUT_Wrapper = document.querySelectorAll(".Input")
const INPUT_label = document.querySelector(".Input > label")

INPUT_Wrapper.forEach((elem, index, array)=>{
  elem.querySelector("input").addEventListener("focus", ()=>{
    elem.classList.add("active")
    elem.querySelector("label").classList.add("active")
  })
  elem.querySelector("input").addEventListener("blur", ()=>{
    if(elem.querySelector("input").value.length > 0) {
      elem.classList.add("active")
      elem.querySelector("label").classList.add("active")
    }else {
      elem.classList.remove("active")
      elem.querySelector("label").classList.remove("active")
    }
  })
  elem.querySelector("input").addEventListener("input", ()=>{
    elem.classList.add("active")
    elem.querySelector("label").classList.add("active")
  })
})
