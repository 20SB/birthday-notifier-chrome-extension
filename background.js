chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['friends'], (result) => {
    if (!result.friends) {
      // Initialize with data from friends.json if storage is empty
      fetch(chrome.runtime.getURL('friends.json'))
        .then(response => response.json())
        .then(data => {
          chrome.storage.local.set({ friends: data });
        });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkBirthday') {
    checkBirthdays().then(names => {
      sendResponse({ birthdays: names });
    });
    return true; // Will respond asynchronously
  }
});

async function checkBirthdays() {
  try {
    const result = await chrome.storage.local.get(['friends']);
    const friends = result.friends || [];

    // Use local time for date checking, as implied by "today" 
    const today = new Date();
    // Get month (0-11) and date (1-31)
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDate = today.getDate(); // 1-31

    const birthdayFriends = friends.filter(friend => {
      const dob = new Date(friend.dob);
      // UTC check might be off depending on how date string is parsed,
      // but "YYYY-MM-DD" usually parses as UTC.
      // However, usually we want to match the user's local day.
      // Let's assume the json date is just a date string.
      // We can manually parse the string to avoid timezone issues.
      const [year, month, day] = friend.dob.split('-').map(Number);
      return month === currentMonth && day === currentDate;
    }).map(f => f.name);

    return birthdayFriends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
}
