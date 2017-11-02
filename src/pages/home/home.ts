import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth"
import { LoginPage } from '../login/login'
import { AngularFireDatabase } from "angularfire2/database";
import firebase from 'firebase';
import { ActionSheetController } from 'ionic-angular';
import { PricePage } from '../price/price';
import {
	GoogleMaps,
	GoogleMap,
	CameraPosition,
	LatLng,
	GoogleMapsEvent,
	Marker,
  MarkerOptions
} from '@ionic-native/google-maps';
import{Geolocation} from '@ionic-native/geolocation';

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  nani;
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
  
  logout(){
  this.afAuth.auth.signOut()  
  this.navCtrl.setRoot(LoginPage) 
  }
  ngAfterViewInit(){
  this.initMap();
  this.getLocation();
  

  }

  ionViewWillLoad(){

  }
  initMap(){
    let element = this.mapElement.nativeElement;
    this._geoLoc.getCurrentPosition().then((position)=> {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      console.log("nani long and lat",lng,lat)
  })

    this.map = this._googleMaps.create(element);
  }  

  getLocation(){
    this._geoLoc.getCurrentPosition().then((position)=> {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log("nani long and lat",lng,lat)
    })

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
  timer(){
    this.navCtrl.push(PricePage);
  }
}





   



