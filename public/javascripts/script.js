let btn = document.querySelector("button.btn.btn-primary");
let address = document.querySelector("input[type=email]");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (address.value == "") {
    alert("Do you want to lose your reward");
  } else {
    fetch("http://localhost:3000/payment", {
      method: "POST",
      body: JSON.stringify({
        address: address.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON from the response
      })
      .then((data) => {
        console.log(data); // Now `data` is the parsed JSON object
        if (data.status) {
          alert(data.message);
        } else {
          alert(data);
        }
         // Show the object as a string in the alert
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    alert("Please wait while we make payment :)");
  }
});
