let btn = document.querySelector("button.btn.btn-primary");
let address = document.querySelector("input[type=email]");
let spin = document.querySelector(".load");
let urlBase = window.location.origin;
let balance =  document.querySelector(".balance-box p.balance")
// let activities layout
const layout = document.querySelector("section.layout");


function active() {
  layout.classList.remove("hide");
}
function dailyBonus() {
  fetch("/daily-bonus")
    .then((data) => data.json())
    .then((d) => {
      console.log(d);
      balance.innerHTML = d.balance + "$";
      closeLayout();
    });
}
function closeLayout() {
  layout.classList.add("hide");
}
