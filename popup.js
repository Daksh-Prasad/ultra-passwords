// Load Passwords from Storage
function loadPasswords() {
  chrome.storage.sync.get(null, (items) => {
    const passwordsList = document.getElementById("passwordsList");
    const clearAllBtn = document.getElementById("clearAllCredentials");
    passwordsList.innerHTML = ""; // Clear the list for fresh display

    // Check if there are any saved credentials
    if (Object.keys(items).length === 0) {
      clearAllBtn.style.display = "none"; // Hide the clear button
      passwordsList.style.display = "none"; // Hide the password list
      return; // Return early if there are no credentials
    } else {
      clearAllBtn.style.display = "block"; // Show clear button
      passwordsList.style.display = "block"; // Show passwords list
      for (let [alias, creds] of Object.entries(items)) {
        const aliasContainer = document.createElement("div");
        aliasContainer.classList.add("aliasContainer");

        // Display Alias (Save As Name)
        const aliasText = document.createElement("strong");
        aliasText.textContent = alias;
        aliasText.classList.add("aliasText");

        // Button to Go to Website
        const websiteLinkBtn = document.createElement("button");
        websiteLinkBtn.textContent = "Go to Website";
        websiteLinkBtn.classList.add("link-btn");
        websiteLinkBtn.addEventListener("click", () => {
          chrome.tabs.create({ url: creds.website });
        });

        // Copy Username Button
        const copyUsernameBtn = document.createElement("button");
        copyUsernameBtn.textContent = "Copy Username";
        copyUsernameBtn.classList.add("copy-btn");
        copyUsernameBtn.addEventListener("click", () => copyToClipboard(creds.username));

        // Copy Password Button
        const copyPasswordBtn = document.createElement("button");
        copyPasswordBtn.textContent = "Copy Password";
        copyPasswordBtn.classList.add("copy-btn");
        copyPasswordBtn.addEventListener("click", () => copyToClipboard(creds.password));

        // Remove Credential Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => {
          chrome.storage.sync.remove(alias, () => {
            alert(`${alias} removed!`);
            loadPasswords(); // Refresh the list after removing
          });
        });

        // Append elements to alias container
        aliasContainer.appendChild(aliasText);
        aliasContainer.appendChild(websiteLinkBtn);
        aliasContainer.appendChild(copyUsernameBtn);
        aliasContainer.appendChild(copyPasswordBtn);
        aliasContainer.appendChild(removeBtn);

        passwordsList.appendChild(aliasContainer);
      }
    }
  });
}

// Copy to Clipboard Function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}

// Handle button visibility
function toggleButtons(isAdding) {
  document.getElementById("addCredential").style.display = isAdding ? "none" : "block";
  document.getElementById("viewCredentials").style.display = isAdding ? "none" : "block";
  document.getElementById("saveCredentialsSection").style.display = isAdding ? "block" : "none";
}

// Save Credentials Logic
document.getElementById("saveCredentials").addEventListener("click", () => {
  const websiteURL = document.getElementById("websiteURL").value;
  const websiteAlias = document.getElementById("websiteAlias").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!websiteURL || !websiteAlias || !username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const credentials = {
    website: websiteURL,
    username: username,
    password: password
  };

  // Save to chrome storage
  chrome.storage.sync.set({ [websiteAlias]: credentials }, () => {
    alert(`${websiteAlias} saved!`);
    // Clear input fields after saving
    document.getElementById("websiteURL").value = '';
    document.getElementById("websiteAlias").value = '';
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    loadPasswords(); // Refresh the list after saving
  });
});

// Clear All Credentials Logic
document.getElementById("clearAllCredentials").addEventListener("click", () => {
  chrome.storage.sync.clear(() => {
    alert("All credentials cleared!");
    loadPasswords(); // Refresh the list after clearing
  });
});

// Event listeners for button toggling
document.getElementById("viewCredentials").addEventListener("click", () => {
  toggleButtons(false); // Show saved credentials section
  loadPasswords(); // Load passwords when viewing
});

document.getElementById("addCredential").addEventListener("click", () => {
  toggleButtons(true); // Show add credential section
});

// Initial State Setup: Ensure the saved credentials are not displayed immediately
document.getElementById("passwordsList").style.display = "none"; // Hide saved credentials section initially
document.getElementById("clearAllCredentials").style.display = "none"; // Hide the clear button initially