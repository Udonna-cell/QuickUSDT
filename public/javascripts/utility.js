



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
  const title = "💸 Join QuickUSDT today and earn $0.008 instantly!";
  const text = `Start completing tasks, events, and more to boost your earnings.\n\n🔗 Sign up now and start earning:`;
  const url = getBaseURL(); // e.g., "https://quickusdt.com"
  const imageUrl = "/images/logo/logo.png";

  try {
    // Try to load image if possible
    let file;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      file = new File([blob], "quickusdt-logo.jpg", { type: blob.type });
    } catch {
      console.warn("⚠️ Image not available or failed to load.");
    }

    // Modern Web Share API with image support
    if (navigator.canShare && file && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text,
        url,
        files: [file],
      });
      console.log("✅ Shared successfully with image!");
    }

    // Web Share API without image
    else if (navigator.share) {
      await navigator.share({
        title,
        text: `${text}\n${url}`,
      });
      console.log("✅ Shared successfully without image.");
    }

    // Fallback for unsupported browsers
    else {
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(`${title}\n\n${text}\n${url}`);

      const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      };

      const platform = prompt(
        "Where would you like to share? (facebook, whatsapp, twitter, telegram)"
      )?.toLowerCase();

      if (platform && shareLinks[platform]) {
        window.open(shareLinks[platform], "_blank");
      } else {
        alert("Invalid platform. Please try again.");
      }
    }
  } catch (err) {
    console.error("❌ Share failed:", err);
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
 alert(core) 
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
async function refreshFrame() {
  let PAGE = document.querySelector(`section.window > .page`)
  let core = document.querySelector(`section.window > .page > section`).classList.value.split(" ")[0].trim()
  let content = await fetchData(core);
  PAGE.innerHTML = "";
  PAGE.innerHTML = (content.page)? content.page : "No data found       :(";
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



//window scroll effect to hide the window nav 
const window_page = document.querySelector("section.window > .page");
const window_header = document.querySelector("section.window > .header")

let scroll_monitor = 0
window_page.addEventListener("scroll",(e)=>{
  if (window_page.scrollTop > 20) {
    window_header.style.top = "-10%"
    //scroll_monitor = window_page.scrollTop
  }
  if (window_page.scrollTop < scroll_monitor) {
    window_header.style.top ="1rem"
    //scroll_monitor = window_page.scrollTop
  }
  scroll_monitor = window_page.scrollTop
});
