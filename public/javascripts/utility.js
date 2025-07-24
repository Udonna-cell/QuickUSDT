function getBaseURL() {
  let userID = document.querySelector("p.subheading").textContent.split(",")[1].trim()
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

function shareContent() {
  // Check for Web Share API support (mostly for mobile)
  let { url, title, text } = {
    url: "https://example.com", title: "Check this out!", text: "This is something interesting to share."
  }
  url = getBaseURL()
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url
    })
      .then(() => console.log("Shared successfully"))
      .catch((err) => console.error("Share failed:", err));
  } else {
    // Fallback for specific platforms
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const platforms = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    };

    // Open in new tabs
    for (const [platform, link] of Object.entries(platforms)) {
      window.open(link, "_blank");
    }
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

// Example usage:


// Example usage:
