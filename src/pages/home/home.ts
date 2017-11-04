import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth"
import { LoginPage } from '../login/login'
import { AngularFireDatabase } from "angularfire2/database";
import firebase from 'firebase';
import { ActionSheetController } from 'ionic-angular';
import { PricePage } from '../price/price';
import{Geolocation} from '@ionic-native/geolocation';
import {
	GoogleMaps,
  GoogleMap,
  CameraPosition,
	LatLng,
	GoogleMapsEvent
} from '@ionic-native/google-maps';


declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  nani;
  coordinates={};
  public toggleStatus: boolean;
  constructor(private afAuth : AngularFireAuth,
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    private _googleMaps: GoogleMaps,
    public actionSheetCtrl: ActionSheetController,
    private _geoLoc: Geolocation) {
      this.toggleStatus=false;
      let database=firebase.database();
      db.object('nani').valueChanges().subscribe(data => {
        this.nani= data;
   });
  }
  
  userPosition;

  logout(){
  this.afAuth.auth.signOut()  
  this.navCtrl.setRoot(LoginPage) 
  }

  moveCamera(loc: LatLng){
    let options: CameraPosition<LatLng> = {
      target: loc,
      zoom: 15,
      tilt: 10

    }
    this.map.moveCamera(options)
  }


  ngAfterViewInit(){
  let loc: LatLng;
  this.initMap();

  this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    this.getLocation().then(res => {
      loc= new LatLng(res.coords.latitude, res.coords.longitude);
      this.moveCamera(loc);
    }).catch(err => {
      console.log(err);
    });
  });
  }
  

  

  ionViewWillLoad(){

  }


  initMap(){
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element);
  }  

getLocation(){
return this._geoLoc.getCurrentPosition();
}

  trackNani(){
    console.log("initial toggle state", this.toggleStatus )
    // var db = firebase.database();    
    // db.ref("nani/YdSV2gxkYoO84TtnOoOjBauEJB33").update({ ava});
    if(this.toggleStatus === true){        
          let naniesFix=this.nani;
          var Nnani = this.afAuth.auth.currentUser;
          var db = firebase.database();    
          db.ref("nani/"+Nnani.uid).update({ available : true});
      let that = this
        var intervalFunc = setInterval(function timer() {
            that._geoLoc.getCurrentPosition().then((position) =>{
              var naniLat = position.coords.latitude;
              var nanilng = position.coords.longitude;
              var db = firebase.database();    
              db.ref("nani/"+Nnani.uid).update({ lat: naniLat, lng:nanilng});
          }, function(error) {
              console.log("map did not load")
          })
        
          }, 1000); 
   
    }else{
      console.log("inside false")
      clearInterval(intervalFunc)
      var Nnani = this.afAuth.auth.currentUser;    
      var db = firebase.database();    
      db.ref("nani/"+Nnani.uid).update({ available : false});
    }
   
   }
  

   isRequested(){
     //if nani is requested
     
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
    document.getElementById('start').addEventListener('change', onChangeHandler);
    // document.getElementById('end').addEventListener('change', onChangeHandler);
    //duration code
    
    // var bounds = new google.maps.LatLngBounds;
    // var destination = 'Yaser Mall';
    // var origin = 'Mecca Mall';
    // var origin = {lat: 31.977285, lng: 35.843623};
    // var destination = {lat: 31.955330, lng: 35.834616};
    var origin = this.coordinates;
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
              console.log(results)
              for (var j = 0; j < results.length; j++) {
              outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                ': ' + results[j].distance.text + ' in ' +
                results[j].duration.text + '<br>';
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
      origin: this.coordinates,
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
}





   



