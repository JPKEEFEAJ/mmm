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
  console.log(params);
  params.forEach((param) => {
    console.log(param);
  });
  const userSelect = params.get("s");
  console.log(userSelect);

  db.ref("/UserData").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().discordUsername == userSelect) {
        displayUser(
          childSnapshot.val().discordUsername,
          childSnapshot.val().blooketUsername,
          childSnapshot.val().points,
          childSnapshot.val().timezone,
          childSnapshot.val().qualifierSet
        );
      }
    });
  });
}

function displayUser(discord, blooket, points, times, qualifier) {
  const DIV = document.getElementById("userData");
  console.log("displayUser");

  let p = document.createElement("p");
  let textnode = document.createTextNode(discord);
  p.appendChild(textnode);
  DIV.appendChild(p);
}

function searching() {
  const test = event.target;
  console.log(test.innerHTML);
  window.location.search = test;
}

main();
