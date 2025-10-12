



function logout() {
  alert(streak)
  // window.location.href = "/logout"
}



function getBaseURL() {
  let userID = document.querySelector("p.subheading").textContent.trim()
  try {
    const parentURL = window.parent.location.href; // May throw if cross-origin
    const urlObj = new URL(parentURL);
    return `${urlObj.protocol}//${urlObj.host}/register?r=${userID}`;
  } catch (err) {
    // Fallback to current window if cross-origin restriction blocks access
    const currentURL = window.location.href;
    const urlObj = new URL(currentURL);
    return `${urlObj.protocol}//${urlObj.host}/register?r=${userID}`;
  }
}



async function shareContent() {
  // alert("man of steel")
  // Content to be shared
  const title = "> 💸 Join *QuickUSDT* today and earn *$0.008 instantly!*";
  const text = `Start completing tasks, events, and more to boost your earnings.\n
🔗 Sign up now and start earning: \n`;
  const url = getBaseURL();

  // Image file URL (must be from the same origin or CORS-enabled)
  const imageUrl = "/images/logo/logo.png"; // Update to your image path

  try {
    // Fetch the image and convert it into a File object
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "shared-image.jpg", { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text,
        url,
        files: [file]
      });
      console.log("Shared successfully with image!");
    } else if (navigator.share) {
      // Fallback to sharing without file if file sharing isn't supported
      await navigator.share({
        title,
        text,
        url
      });
      console.log("Shared successfully without image.");
    } else {
      // Fallback for platforms without Web Share API
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);

      const platforms = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      };

      for (const [platform, link] of Object.entries(platforms)) {
        window.open(link, "_blank");
      }
    }
  } catch (err) {
    console.error("Share failed:", err);
  }
}


function copyToClipboard() {
  const text = getBaseURL();
  if (navigator.clipboard && window.isSecureContext) {
    // navigator.clipboard API is supported
    navigator.clipboard.writeText(text)
      .then(() => console.log("Copied to clipboard!"))
      .catch(err => console.error("Failed to copy:", err));
  } else {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("Copied to clipboard using fallback!");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    document.body.removeChild(textarea);
  }
}

let isPageOpen = false

async function frameToggle(option, core) {
  // console.log(option);
  let app = document.querySelector(`section.${option}`);
  document.querySelector(`section.${option} > .page`).innerHTML = "";
  
  isPageOpen = !isPageOpen
  if (isPageOpen) {
    app.style.top = '0%';
    let content = await fetchData(core);
    // console.log(content.page);
    
  document.querySelector(`section.${option} > .page`).innerHTML = (content.page)? content.page : "No data found :(";
  if(core == "referral"){
    document.querySelector("input#referral-link").value = getBaseURL().split("=")[0] + "=xxxxx";
  }
  } else {
    app.style.top = '100%';
  }
}

function withdraw() {
  document.body.style.overflow = "hidden"
  const tab = document.querySelector("section.tab.withdraw-tab").style.bottom = "1rem";
}
function deposit() {
  document.body.style.overflow = "hidden"
  const tab = document.querySelector("section.tab.deposit-tab").style.bottom = "1rem";
}




// Gesture logic 178

function SwipeDownQuestion(me) {
  document.body.style.overflow = "scroll"
  const tab = me.style.bottom = "-100%";
}

// Detect swipe-down gesture
let touchStartY = 0;

document.querySelectorAll("section.tab").forEach((element) => {
  element.addEventListener("touchstart", function (e) {
    touchStartY = e.changedTouches[0].screenY;
  });
});

document.querySelectorAll("section.tab").forEach((element) => {
  element.addEventListener("touchend", function (e) {
    let touchEndY = e.changedTouches[0].screenY;

    if (touchEndY - touchStartY > 50) { // threshold for swipe down
      SwipeDownQuestion(this);
    }
  });
});



// Define an async function to fetch data
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message || error);
    return false;
  }
}