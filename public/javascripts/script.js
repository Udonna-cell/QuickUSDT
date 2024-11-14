let btn = document.querySelector("button.btn.btn-primary");
let address = document.querySelector("input[type=email]");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (address.value == "") {
    alert("Do you want to lose your reward");
  } else {
    fetch("http://192.168.43.11:3000/payment", {
      method: "POST",
      body: JSON.stringify({
        address: address.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    alert("Please wait while we make payment :)");
  }
});
