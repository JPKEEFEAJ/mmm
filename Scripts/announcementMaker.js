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



function updateAnnouncements() {
  const date = new Date();

  let time = date.getTime();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${time}`;
  let DMY = `${day}-${month}-${year}`;

  const hash = window.location.hash.slice(1);
  firebase
    .database()
    .ref("/")
    .child("Announcements")
    .child(currentDate)
    .set({
      date: DMY,
      time: time,
      text: document.getElementById("textInput").value,
      title: document.getElementById("titleInput").value,
      admin: hash
    });
}