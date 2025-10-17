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
let isClaimingBonus = false;

function dailyBonus(isBonusClaimed) {
  if (isClaimingBonus) return; // 🛑 prevent multiple calls
  isClaimingBonus = true;      // 🔒 lock

  fetch("/daily-bonus")
    .then((res) => res.json())
    .then((d) => {
      console.log(d);
      balance.innerHTML = d.balance + "$";
      frameToggle('window', 'bonus');
    })
    .catch((err) => console.error(err))
    .finally(() => {
      isClaimingBonus = false; // 🔓 unlock after done
    });
}
function closeLayout() {
  layout.classList.add("hide");
}
