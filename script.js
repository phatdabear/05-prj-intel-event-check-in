const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
//Track attendence
let count = 0;
const maxCount = 50;

//Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  //Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);
  //Increment count and check if max count is reached
  count++;
  console.log("total checkins: ", count);

  //Update attendee list and count display
  const percentage = Math.round((count / maxCount) * 100) + "%";
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;
  console.log("Progress: ", percentage);
  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;
  //Show welcome message
  const welcomeMessage = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = welcomeMessage;
  console.log(welcomeMessage);

  form.reset();
});
