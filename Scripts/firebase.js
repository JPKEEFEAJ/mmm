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

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function main() {
  makeTopNav();
  displaySearch();
}

function makeTopNav() {
  const NAV = document.getElementById("topNav");
  NAV.innerHTML = "";
  db.ref("/UserData").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const DIV = document.createElement("div");
      DIV.setAttribute("onclick", "searching()");
      DIV.setAttribute("href", `?s=${childSnapshot.val().discordUsername}`);
      let textnode = document.createTextNode(
        childSnapshot.val().discordUsername
      );
      DIV.appendChild(textnode);
      NAV.appendChild(DIV);
    });
  });
}

function displaySearch() {
  const temp = location.search;
  const params = new URLSearchParams(temp);
  const userSelect = params.get("s");
  console.log(userSelect);

  db.ref("/UserData").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().discordUsername == userSelect) {
        displayUser(
          childSnapshot.val().discordUsername,
          childSnapshot.val().blooketUsername,
          childSnapshot.val().points,
          childSnapshot.val().qualifierSet,
          childSnapshot.val().timezone
        );
        timeTable(childSnapshot.val().timeAvailability);
      }
    });
  });
}
function returnSearch() {
  const temp = location.search;
  const params = new URLSearchParams(temp);
  const userSelect = params.get("s");
  return userSelect;
}

function displayUser(discord, blooket, points, qualifier, timezone) {
  let textnode;
  const DIV = document.getElementById("userData");
  DIV.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let p = document.createElement("p");
    if (i == 0) {
      textnode = document.createTextNode(`Discord: ${discord}`);
    } else if (i == 1) {
      textnode = document.createTextNode(`Blooket: ${blooket}`);
    } else if (i == 2) {
      textnode = document.createTextNode(`Points: ${points}`);
      p.style.display = "inline";
    } else if (i == 3) {
      textnode = document.createTextNode(`Qualifier Set: ${qualifier}`);
    } else if (i == 4) {
      textnode = document.createTextNode(`Timezone: ${timezone}`);
    }
    p.appendChild(textnode);

    DIV.appendChild(p);
    if (i == 2) {
      const INPUT = document.createElement("input");
      INPUT.id = "pointsInput";
      INPUT.setAttribute("type", "number");
      INPUT.setAttribute("value", `${points}`);
      DIV.appendChild(INPUT);

      const SUBMIT = document.createElement("button");
      SUBMIT.innerHTML = "Submit Points";
      SUBMIT.setAttribute("onclick", "submitPoints()");
      DIV.appendChild(SUBMIT);
    }
  }
}

function timeTable(times) {
  const tableDiv = document.getElementById("timeTable");
  tableDiv.innerHTML = "";
  const table = document.createElement("table");
  let textnode;

  let temp = times[0];

  setUpTable();

  temp = temp.mondays[0];
  tableRow(0);
  temp = times[0].tuesdays[0];
  tableRow(1);
  temp = times[0].wednesdays[0];
  tableRow(2);
  temp = times[0].thursdays[0];
  tableRow(3);
  temp = times[0].fridays[0];
  tableRow(4);
  temp = times[0].saturdays[0];
  tableRow(5);
  temp = times[0].sundays[0];
  tableRow(6);

  function setUpTable() {
    const tr = document.createElement("tr");

    const spacer = document.createElement("th");
    tr.appendChild(spacer);

    for (let i = 0; i < 24; i++) {
      const th = document.createElement("th");
      if (i < 12) {
        textnode = document.createTextNode(i + 1 + "AM");
      } else if (i > 11) {
        textnode = document.createTextNode(i - 11 + "PM");
      }
      th.appendChild(textnode);

      tr.appendChild(th);
      table.appendChild(tr);
    }
  }

  function tableRow(day) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    textnode = document.createTextNode(daysOfWeek[day]);
    th.appendChild(textnode);
    tr.appendChild(th);

    for (let i = 0; i < 24; i++) {
      const td = document.createElement("td");
      if (temp[i]) {
        td.classList.add("true");
      } else if (!temp[i]) {
        td.classList.add("false");
      }
      textnode = document.createTextNode(temp[i]);
      td.appendChild(textnode);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  tableDiv.appendChild(table);
}

function searching() {
  const test = event.target;
  window.location.search = `s=${test.innerHTML}`;
}

function submitPoints() {
  db.ref("/UserData")
    .child(returnSearch())
    .update({
      points: Number(document.getElementById("pointsInput").value)
    });
}

main();
console.log(returnSearch());
