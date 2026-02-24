const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

const COUNT_KEY = "intelCheckInCount";
const TEAM_COUNTS_KEY = "intelCheckInTeamCounts";
const ATTENDEES_KEY = "intelCheckInAttendees";

//Track attendence
let count = 0;
const maxCount = 50;
let attendees = [];

function getTeamName(teamCode) {
  if (teamCode === "water") {
    return "Team Water Wise";
  }

  if (teamCode === "zero") {
    return "Team Net Zero";
  }

  if (teamCode === "power") {
    return "Team Renewables";
  }

  return "Unknown Team";
}

function updateProgress() {
  const percentageNumber = Math.min(Math.round((count / maxCount) * 100), 100);
  attendeeCount.textContent = count;
  progressBar.style.width = percentageNumber + "%";
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";
    listItem.textContent = attendee.name + " — " + getTeamName(attendee.team);
    attendeeList.appendChild(listItem);
  }
}

function getTeamCounts() {
  return {
    water: parseInt(waterCount.textContent, 10),
    zero: parseInt(zeroCount.textContent, 10),
    power: parseInt(powerCount.textContent, 10),
  };
}

function saveProgress() {
  const teamCounts = getTeamCounts();
  localStorage.setItem(COUNT_KEY, count.toString());
  localStorage.setItem(TEAM_COUNTS_KEY, JSON.stringify(teamCounts));
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees));
}

function getWinningTeamName() {
  const teamCounts = getTeamCounts();
  let winningTeamCode = "water";
  let winningTeamCount = teamCounts.water;

  if (teamCounts.zero > winningTeamCount) {
    winningTeamCode = "zero";
    winningTeamCount = teamCounts.zero;
  }

  if (teamCounts.power > winningTeamCount) {
    winningTeamCode = "power";
  }

  return getTeamName(winningTeamCode);
}

function showMessage(message, className) {
  greeting.textContent = message;
  greeting.className = className;
  greeting.style.display = "block";
}

function showCelebrationMessage() {
  const winningTeamName = getWinningTeamName();
  const celebrationText = `🎉 Goal reached! Winning team: ${winningTeamName}`;
  showMessage(celebrationText, "celebration-message");
}

function loadSavedProgress() {
  const savedCount = localStorage.getItem(COUNT_KEY);
  const savedTeamCounts = localStorage.getItem(TEAM_COUNTS_KEY);
  const savedAttendees = localStorage.getItem(ATTENDEES_KEY);

  if (savedCount) {
    count = parseInt(savedCount, 10);
  }

  if (savedTeamCounts) {
    const teamCounts = JSON.parse(savedTeamCounts);
    waterCount.textContent = teamCounts.water;
    zeroCount.textContent = teamCounts.zero;
    powerCount.textContent = teamCounts.power;
  }

  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
  }

  updateProgress();
  renderAttendeeList();

  if (count >= maxCount) {
    showCelebrationMessage();
  }
}

loadSavedProgress();

//Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  if (count >= maxCount) {
    showCelebrationMessage();
    return;
  }

  //Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) {
    return;
  }

  //Increment count and check if max count is reached
  count++;

  //Update attendee list and count display
  updateProgress();

  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  attendees.push({
    name: name,
    team: team,
  });

  renderAttendeeList();

  //Show welcome message
  const welcomeMessage = `Welcome, ${name} from ${teamName}!`;
  showMessage(welcomeMessage, "success-message");

  saveProgress();

  if (count === maxCount) {
    showCelebrationMessage();
  }

  form.reset();
});
