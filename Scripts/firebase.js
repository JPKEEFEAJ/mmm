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
          childSnapshot.val().timeAvailability[0],
          childSnapshot.val().qualifierSet,
          childSnapshot.val().timezone
        );
      }
    });
  });
}

function displayUser(discord, blooket, points, times, qualifier, timezone) {
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
    } else if (i == 3) {
      textnode = document.createTextNode(`Qualifier Set: ${qualifier}`);
    } else if (i == 4) {
      textnode = document.createTextNode(`Timezone: ${timezone}`);
    }
    p.appendChild(textnode);
    DIV.appendChild(p);
  }
}

function searching() {
  const test = event.target;
  window.location.search = `s=${test.innerHTML}`;
}

main();