let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");
let plus = document.getElementById("plus");
let minus = document.getElementById("minus");
let m5 = document.getElementById("5m");
let m10 = document.getElementById("10m");
let m15 = document.getElementById("15m");
let start = document.getElementById("start");
let reset = document.getElementById("reset");

let ClockIsRunning;
let TimeOutClock;

function updateClock() {
  chrome.storage.local.get("ClockIsRunning", (res) => {
    ClockIsRunning = res.ClockIsRunning ?? false;
  });
  if (ClockIsRunning == true) {
    chrome.storage.local.get(["minutes", "seconds"], (res) => {
      minutes.innerText = res.minutes < 10 ? "0" + res.minutes : res.minutes;
      seconds.innerText = res.seconds < 10 ? "0" + res.seconds : res.seconds;
    });
  }
}

updateClock();
TimeOutClock = setInterval(updateClock, 100);

plus.addEventListener("click", () => {
  if (!ClockIsRunning) {
    let numberOfMinutes = Math.min(parseInt(minutes.innerText) + 1, 60);
    if (numberOfMinutes < 10) {
      minutes.innerText = "0" + numberOfMinutes;
    } else {
      minutes.innerText = numberOfMinutes;
    }
  }
});

minus.addEventListener("click", () => {
  if (!ClockIsRunning) {
    let numberOfMinutes = Math.max(parseInt(minutes.innerText) - 1, 0);
    if (numberOfMinutes < 10) {
      minutes.innerText = "0" + numberOfMinutes;
    } else {
      minutes.innerText = numberOfMinutes;
    }
  }
});

m5.addEventListener("click", () => {
  if (!ClockIsRunning) {
    minutes.innerText = "05";
  }
});
m10.addEventListener("click", () => {
  if (!ClockIsRunning) {
    minutes.innerText = "10";
  }
});
m15.addEventListener("click", () => {
  if (!ClockIsRunning) {
    minutes.innerText = "15";
  }
});

start.addEventListener("click", () => {
  ClockIsRunning = true;
  chrome.storage.local.set({
    ClockIsRunning: true,
    minutes: parseInt(minutes.innerText),
    seconds: parseInt(seconds.innerText),
  });
  TimeOutClock = setInterval(updateClock, 100);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.local.set({ tabToClose: tabs[0].id }, () => {
      console.log("Set Tabs to close to" + tabs[0].id);
    });
  });
});

reset.addEventListener("click", () => {
  ClockIsRunning = false;
  chrome.storage.local.set({
    ClockIsRunning: false,
    minutes: 0,
    seconds: 0,
  });
  chrome.action.setBadgeText({ text: "" });
  clearInterval(TimeOutClock);
  minutes.innerText = "00";
  seconds.innerText = "00";
});
