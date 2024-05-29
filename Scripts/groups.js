const firebaseConfig = {
  apiKey: "AIzaSyAy0cS2jSi87qZS2anfNxCW1VWsog02wto",
  authDomain: "raceto100-89d5b.firebaseapp.com",
  databaseURL: "https://raceto100-89d5b-default-rtdb.firebaseio.com/",
  projectId: "raceto100-89d5b",
  storageBucket: "raceto100-89d5b.appspot.com",
  messagingSenderId: "844266038345",
  appId: "1:844266038345:web:8f2591989462b484148b98"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

function getRound() {
  const temp = location.search;
  const params = new URLSearchParams(temp);
  const userSelect = params.get("r");
  return userSelect;
}
console.log(getRound());

$("div.roundSelect").click(function () {
  let temp = event.target;
  temp = temp.innerHTML;
  window.location.search = `s=${temp.innerHTML}`;
});

function makeGroupSettings(groupAmmount) {
  const MAIN_DIV = document.getElementById("groupSettings");
  MAIN_DIV.innerHTML = "";
  let textnode;

  for (let i = 0; i < groupAmmount; i++) {
    const DIV = document.createElement("div");
    DIV.className = "groupDiv";
    DIV.id = `group_${i}`;

    const DIV_LABEL = document.createElement("label");
    DIV_LABEL.setAttribute("for", `group_${i}`);
    DIV_LABEL.innerHTML = `G${i + 1}`;
    MAIN_DIV.appendChild(DIV_LABEL);

    const DIV1 = document.createElement("div");
    DIV1.style.display = "inline-block";

    const DATE_LABEL = document.createElement("label");
    DATE_LABEL.setAttribute("for", `groupDateInput_${i}`);
    DATE_LABEL.innerHTML = "Date";
    DIV1.appendChild(DATE_LABEL);

    const DATE_INPUT = document.createElement("input");
    DATE_INPUT.id = `groupDateInput_${i}`;
    DATE_INPUT.setAttribute("type", "text");
    DATE_INPUT.setAttribute("placeholder", "June 1");
    DIV1.appendChild(DATE_INPUT);

    const TIME_LABEL = document.createElement("label");
    TIME_LABEL.setAttribute("for", `groupTimeInput_${i}`);
    TIME_LABEL.innerHTML = "Time";
    DIV1.appendChild(TIME_LABEL);

    const TIME_INPUT = document.createElement("input");
    TIME_INPUT.id = `groupTimeInput_${i}`;
    TIME_INPUT.setAttribute("type", "text");
    TIME_INPUT.setAttribute("placeholder", "14:00");
    DIV1.appendChild(TIME_INPUT);

    DIV.appendChild(DIV1);

    const BR = document.createElement("br");
    DIV.appendChild(BR);

    const DIV2 = document.createElement("div");
    DIV2.id = `playerDiv_${i}`;
    DIV2.classList.add("groupDiv");
    DIV2.classList.add("playerDiv");
    DIV2.style.display = "block";
    DIV2.setAttribute("ondragover", "allowDrop(event)");
    DIV2.setAttribute("ondrop", "dragDrop(event)");

    DIV.appendChild(DIV2);

    MAIN_DIV.appendChild(DIV);
  }
}

function getPlayers() {
  const MAIN_DIV = document.getElementById("players");
  MAIN_DIV.innerHTML = "";

  db.ref("/")
    .child("UserData")
    .on("value", function (snapshot) {
      let i = 0;
      snapshot.forEach(function (childSnapshot) {
        console.log(childSnapshot.val());

        const userDiv = document.createElement("div");
        userDiv.id = `player_${i}`;
        userDiv.className = "userDiv";
        userDiv.innerHTML = childSnapshot.val().blooketUsername;
        userDiv.setAttribute("draggable", "true");
        userDiv.setAttribute("ondragstart", "dragStart(event)");
        MAIN_DIV.appendChild(userDiv);

        i++;
      });
    });
}

//Should allow for dragging
function allowDrop(ev) {
  ev.preventDefault();
}

function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragDrop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  if (ev.target.className.includes("playerDiv")) {
    ev.target.appendChild(document.getElementById(data));
  }
}

function resetPlayers() {
  const playerBoxes = document.querySelectorAll(".playerDiv");
  playerBoxes.forEach(function (element) {
    element.innerHTML = "";
  });
  getPlayers();
}

const input = document.getElementById("groupAmmount");
input.addEventListener("input", (event) => {
  makeGroupSettings(event.target.value);
  getPlayers();
});

makeGroupSettings(2);
getPlayers();

function makeSettings() {
  const MAIN_DIV = document.getElementById("settings");
  MAIN_DIV.innerHTML = "";

  const DIV = document.createElement("div");
  DIV.classList.add("groupDiv");
  DIV.classList.add("centered");

  settingInputMake(0, "date", "June 2 - June 7");
  settingInputMake(1, "desc", "A game of Gold Quest");
  settingInputMake(2, "mode", "Gold Quest");
  settingInputMake(3, "set", "blooket.games");
  settingInputMake(4, "setMaker", "Leo");
  settingInputMake(5, "setTitle", "Guess the Logo");
  settingInputMake(6, "time", "7 Min");
  settingInputMake(7, "scale", "0.001");

  MAIN_DIV.appendChild(DIV);

  function settingInputMake(num, value, ex) {
    const LABEL = document.createElement("label");
    LABEL.setAttribute("for", `settingInput_${num}`);
    LABEL.innerHTML = value;
    DIV.appendChild(LABEL);

    const INPUT = document.createElement("input");
    INPUT.id = `settingInput_${num}`;
    INPUT.setAttribute("type", "text");
    INPUT.setAttribute("placeholder", ex);
    DIV.appendChild(INPUT);
  }
}

makeSettings();

function submitGroup() {
  db.ref("/").child("Rounds").child(getRound()).set({
    fruitSalad: "Yummy Yummy"
  });
  //Make Each Group
  const groupAmmount = Number(document.getElementById("groupAmmount").value);
  console.log(groupAmmount);
  for (let i = 0; i < groupAmmount; i++) {
    let key = i;
    var obj = {};
    db.ref("/")
      .child("Rounds")
      .child(getRound())
      .child("Groups")
      .child(`G${i + 1}`)
      .update({
        Group: `G${i + 1}`,
        Settings: {
          date: document.getElementById(`groupDateInput_${i}`).value,
          time: `${document.getElementById(`groupTimeInput_${i}`).value} EST`
        }
      });
    const playerBoxes = document.querySelectorAll(".playerDiv");
    console.log(playerBoxes[i]);
    const playerCount = playerBoxes[i].childNodes.length;
    const players = playerBoxes[i].childNodes;
    console.log(`Player Count Box ${i}: ${playerCount}`);
    const PLAYERS = [];
    let a = 0;
    players.forEach(function (player) {
      PLAYERS[a] = player.innerHTML;
      a++;
    });
    console.log(PLAYERS);
    db.ref("/")
      .child("Rounds")
      .child(getRound())
      .child("Groups")
      .child(`G${i + 1}`)
      .update({
        players: PLAYERS
      });
  }
  db.ref("/")
    .child("Rounds")
    .child(getRound())
    .child("Settings")
    .update({
      date: document.getElementById("settingInput_0").value,
      desc: document.getElementById("settingInput_1").value,
      mode: document.getElementById("settingInput_2").value,
      set: document.getElementById("settingInput_3").value,
      setMaker: document.getElementById("settingInput_4").value,
      setTitle: document.getElementById("settingInput_5").value,
      time: document.getElementById("settingInput_6").value,
      scale: document.getElementById("settingInput_7").value
    });
}
