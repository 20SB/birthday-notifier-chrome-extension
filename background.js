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
    const response = await fetch(chrome.runtime.getURL('friends.json'));
    const friends = await response.json();
    
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
