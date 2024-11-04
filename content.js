// Function to get the hostname for URL matching
function getDomain(url) {
  const hostname = new URL(url).hostname;
  return hostname.replace(/^www\./, '');  // Remove 'www' if it exists
}

chrome.storage.sync.get(null, (items) => {
  const currentURL = getDomain(window.location.href);

  if (items[currentURL]) {
    const { username, password } = items[currentURL];

    // Add event listener after a slight delay to ensure inputs are loaded
    setTimeout(() => {
      document.addEventListener("keydown", (event) => {
        const activeElement = document.activeElement;

        // Check if the active element is an input field
        if (activeElement && activeElement.tagName.toLowerCase() === "input") {
          
          // Replace '1' with the username
          if (event.key === "1") {
            event.preventDefault();  // Prevent '1' from being entered
            activeElement.value = username; // Assign username as text
          }
          
          // Replace '2' with the password
          if (event.key === "2") {
            event.preventDefault();  // Prevent '2' from being entered
            activeElement.value = password; // Assign password as text
          }
        }
      });
    }, 500);  // Adjust delay if needed
  }
});