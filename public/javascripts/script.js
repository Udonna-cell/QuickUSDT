let btn = document.querySelector("button.btn.btn-primary");
let address = document.querySelector("input[type=email]");
let spin = document.querySelector(".load");
let urlBase = window.location.origin




function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(input) {
  let username = getCookie(input);
  if (username != "") {
   address.value = username
   return true
  } else {
    return false
  }
}

checkCookie("address")

btn.addEventListener("click", (e) => {
  e.preventDefault();
  spin.style.display = "block";
  if (address.value == "") {
    Swal.fire({
      title: "Missing Address",
      text: "Do you want to lose your reward",
      icon: "warning",
    }).then((d) => {
      spin.style.display = "none";
    });
  } else {
    let isCookieSet = checkCookie("address")
    if (isCookieSet == false) {
      setCookie("address", (address.value), 365);
    }
    Swal.fire({
      title: "Transaction processing",
      text: "Please wait while we make payment :)",
      icon: "info",
      showConfirmButton: false,
      timer: 1500,
    }).then((value) => {
      if (true) {
        fetch(`${urlBase}/payment`, {
          method: "POST",
          body: JSON.stringify({
            address: address.value,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the JSON from the response
          })
          .then((data) => {
            console.log(data); // Now `data` is the parsed JSON object
            if (data.status == true) {
              Swal.fire({
                title: "Claimed",
                text: data.message,
                icon: "success",
              }).then((d) => {
                spin.style.display = "none";
                window.location.reload();
              });
            } else {
              Swal.fire({
                title: "Failed to claim",
                text: data.message,
                icon: "error",
              }).then((d) => {
                spin.style.display = "none";
                window.location.reload();
              });
            }
            // Show the object as a string in the Swal.fire
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
            Swal.fire({
              title: "Claim error",
              text: "Failed to claim please try again",
              icon: "error",
            }).then((d) => {
              spin.style.display = "none";
            });
          });
      }
    });
  }
});