document.addEventListener('DOMContentLoaded', () => {
    loadFriends();

    document.getElementById('add-btn').addEventListener('click', addFriend);
    document.getElementById('show-notification-btn').addEventListener('click', triggerNotification);
});

function addFriend() {
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const messageDiv = document.getElementById('message');

    if (!name || !dob) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Please fill in both fields.';
        return;
    }

    const newFriend = { name, dob };

    chrome.storage.local.get(['friends'], (result) => {
        const friends = result.friends || [];
        friends.push(newFriend);

        chrome.storage.local.set({ friends: friends }, () => {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Friend added successfully!';
            document.getElementById('name').value = '';
            document.getElementById('dob').value = '';
            loadFriends();

            // Clear message after 2 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 2000);
        });
    });
}

function loadFriends() {
    chrome.storage.local.get(['friends'], (result) => {
        const friends = result.friends || [];
        const list = document.getElementById('friends-list');
        list.innerHTML = '';

        friends.forEach(friend => {
            const li = document.createElement('li');
            li.textContent = `${friend.name} (${friend.dob})`;
            list.appendChild(li);
        });
    });
}

function triggerNotification() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'triggerCheck' });
        }
    });
}
