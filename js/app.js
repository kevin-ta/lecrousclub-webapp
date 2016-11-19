//Config
var config = {
    apiKey: "AIzaSyAayeqvVKMxeEuEpPdc2kqd0tAZ8PDK9II",
    authDomain: "le-crous-club.firebaseapp.com",
    databaseURL: "https://le-crous-club.firebaseio.com",
    storageBucket: "le-crous-club.appspot.com",
    messagingSenderId: "997225793056"
};
var app = firebase.initializeApp(config);
var storage = app.storage();
var database = app.database();

//Create user
function writeUserData(userId, name) {
    database.ref('users/' + userId).set({
        name: name
    });
}

//Participate or not function
function participateData(name, bool) {
    var updates = {};
    updates['/resas/' + getDate() + '/' + name] = bool;
    firebase.database().ref().update(updates);
}

function getCurrentDate() {
    var currentDate = new Date(new Date().getTime());
    if(currentDate.getHours() > 13) {
        var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    }
    return currentDate;
}

function getDate() {
    var currentDate = getCurrentDate();
    var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
    var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    var year = currentDate.getFullYear();
    return day + "-" + month + "-" + year;
}

//Get list of users
var users = database.ref('resas/' + getDate());
users.on('value', function(snapshot) {
    var vrais = "";
    var faux = "";
    snapshot.forEach(function(snapshot) {
        if(snapshot.val() == true) {
            vrais = vrais + "<li>" + snapshot.key + "</li>";
        }
        else {
            faux = faux + "<li>" + snapshot.key + "</li>";
        }
    });
    document.getElementById("vrais").innerHTML = vrais;
    document.getElementById("faux").innerHTML = faux;
});

document.getElementById("date").innerHTML = getDate();

//If logged or not
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#login").hide();
        $("#logout").show();
        $("#connected").show();
        $("#disconnected").hide();
        var userId = user.uid;
        var name = user.displayName;
        writeUserData(userId, name);
        var currentDate = getCurrentDate();
        if(currentDate.getDay()%6==0) {
            document.getElementById("connected").innerHTML = "<h4>Le Crous est fermé le weekend, reviens plus tard.</h4>";
        }
    } else {
        $("#logout").hide();
        $("#login").show();
        $("#connected").hide();
        $("#disconnected").show();
    }
});

//Google Auth
$("#login").click(function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
});
$("#logout").click(function() {
    firebase.auth().signOut().then(function() {
    }, function(error) {
    });
});

//Participate or not listener
$("#yes").click(function() {
    var user = firebase.auth().currentUser;
    participateData(user.displayName, true)
});
$("#no").click(function() {
    var user = firebase.auth().currentUser;
    participateData(user.displayName, false)
});