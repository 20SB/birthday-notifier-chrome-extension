// Check on load
checkForBirthdays();

// Listen for manual trigger
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'triggerCheck') {
        checkForBirthdays();
    }
});

function checkForBirthdays() {
    chrome.runtime.sendMessage({ action: 'checkBirthday' }, (response) => {
        if (response && response.birthdays.length > 0) {
            showNotification(response.birthdays);
        }
    });
}

function showNotification(names) {
    const banner = document.createElement('div');
    banner.id = 'birthday-notification-banner';

    let namesString = "";
    if (names.length === 1) {
        namesString = names[0];
    } else if (names.length === 2) {
        namesString = names.join(" and ");
    } else {
        namesString = names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
    }

    banner.innerHTML = `
    <span>🎉 Happy Birthday, ${namesString}! 🎂</span>
    <button class="close-btn" id="birthday-close-btn">&times;</button>
  `;

    document.body.appendChild(banner);

    document.getElementById('birthday-close-btn').addEventListener('click', () => {
        banner.remove();
    });
}
