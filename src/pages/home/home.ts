import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth"
import { LoginPage } from '../login/login'
import { AngularFireDatabase } from "angularfire2/database";
import firebase from 'firebase';
import { ActionSheetController } from 'ionic-angular';
import{Geolocation} from '@ionic-native/geolocation';
import { PricePage } from '../price/price';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  nani;
  coordinates={};
  intervalFunc;
  users;
  userId1;
  public toggleStatus: boolean;
  constructor(private afAuth : AngularFireAuth,
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController,
    private _geoLoc: Geolocation) {
      this.toggleStatus=false;
      let database=firebase.database();
      db.object('nani').valueChanges().subscribe(data => {
        this.nani= data;
   });
   db.object('users').valueChanges().subscribe(data => {
    this.users= data;
    console.log(this.users)
  });
      let that = this
      database.ref('/active').on('value', function(snapshot) {
       let objectOfServices = snapshot.val();
       var Nnani = afAuth.auth.currentUser;
       console.log(Nnani.uid, objectOfServices)
       for(var keyy in objectOfServices){
         console.log("nainId",objectOfServices[keyy].nani_id);
         var c = 0;
         if(Nnani.uid===objectOfServices[keyy].nani_id){
           c++
           console.log("nani in requested",objectOfServices[keyy].user_position, keyy)
           console.log("testtttttttt",objectOfServices[keyy].user_id)
           that.userPosition = objectOfServices[keyy].user_position
           that.showDirectionAndDuration();
           console.log("ussssssssser position",that.userPosition)
           alert("You Have Been Requested");
           that.userId1 = objectOfServices[keyy].user_id;
          console.log(that.users);           
         }
       }

     });
  }
  
  userPosition;
  naniPosition;

  logout(){
  this.afAuth.auth.signOut()  
  this.navCtrl.setRoot(LoginPage) 
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

  ionViewWillLoad(){
    this.initMap();

  }

  initMap(){
    let x = this;
    this._geoLoc.getCurrentPosition().then(position => {
      x.naniPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let location = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapTypeId: "terrain"
      });
    });
  }  

  trackNani(){
    console.log("initial toggle state", this.toggleStatus )
    if(this.toggleStatus === true){        
          let naniesFix=this.nani;
          var Nnani = this.afAuth.auth.currentUser;
          var db = firebase.database();    
          db.ref("nani/"+Nnani.uid).update({ available : true});
      let that = this
        this.intervalFunc = setInterval(function timer() {
            that._geoLoc.getCurrentPosition().then((position) =>{
              var naniLat = position.coords.latitude;
              var nanilng = position.coords.longitude;
              console.log(naniLat, nanilng);
              var db = firebase.database();    
              db.ref("nani/"+Nnani.uid).update({ lat: naniLat, lng:nanilng});
          }, function(error) {
              console.log("map did not load")
          })
        
          }, 1000); 
   
    }else{
      console.log("inside false")
      clearInterval(this.intervalFunc)
      var Nnani = this.afAuth.auth.currentUser;    
      var db = firebase.database();    
      db.ref("nani/"+Nnani.uid).update({ available : false});
    }
   
   }
  

   showDirectionAndDuration(){
    //direction code
    let x = this;
    let markerArray = [];
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});
    let stepDisplay = new google.maps.InfoWindow;
    this.calculateAndDisplayRoute( directionsDisplay, directionsService, markerArray, stepDisplay, this.map);
    var onChangeHandler = function() {
      x.calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, this.map);
    };
    var origin = this.naniPosition;
    var destination = x.userPosition;
    // var geocoder = new google.maps.Geocoder;
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    },function(response, status) {
        if (status !== 'OK') {
          alert('Error was: ' + status);
        } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            var outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
              for (var key3 in x.users[x.userId1]) {
                if(key3 === "firstName" || key3 === "phoneNumber"){
                  outputDiv.innerHTML += x.users[x.userId1][key3] + '<br>'                  
                }
             }
            }
          }
      });
  }
  calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map){
    let x = this;
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
    directionsService.route({
      origin: this.naniPosition,
      destination: x.userPosition,
      travelMode: 'DRIVING'
    }, function(response, status) {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === 'OK') {
        document.getElementById('warnings-panel').innerHTML =
            '<b>' + response.routes[0].warnings + '</b>';
        directionsDisplay.setDirections(response);
        x.showSteps(response, markerArray, stepDisplay, map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  showSteps(directionResult, markerArray, stepDisplay, map){
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
  }
  attachInstructionText(stepDisplay, marker, text, map){
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

  timer(){
    this.toggleStatus=false;
    this.trackNani();
    this.navCtrl.push(PricePage);
  }
}
