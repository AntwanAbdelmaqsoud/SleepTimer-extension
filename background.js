chrome.alarms.create({
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(["ClockIsRunning", "minutes", "seconds"], (res) => {
    if (res.ClockIsRunning) {
      res.seconds -= 1;
      if (res.seconds == -1) {
        if (res.minutes == 0) {
          res.seconds = 0;
          chrome.action.setBadgeText({ text: "" });
          res.ClockIsRunning = false;
          chrome.storage.local.get("tabToClose", (res) => {
            try {
              chrome.tabs
                .remove(res.tabToClose)
                .catch((error) => console.log(error));
            } catch (error) {
              console.log(error);
            }
          });
        } else {
          res.seconds = 59;
          res.minutes -= 1;
        }
      }
      if (res.ClockIsRunning) {
        chrome.action.setBadgeText({ text: `${res.minutes}:${res.seconds}` });
      }
      chrome.storage.local.set({
        ClockIsRunning: res.ClockIsRunning,
        minutes: res.minutes,
        seconds: res.seconds,
      });
    }
  });
});
