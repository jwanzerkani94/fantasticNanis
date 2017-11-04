import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth"
import { LoginPage } from '../login/login'
import { AngularFireDatabase } from "angularfire2/database";
import firebase from 'firebase';
import { ActionSheetController } from 'ionic-angular';
import { PricePage } from '../price/price';
import { GoogleMaps } from '@ionic-native/google-maps';


declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  nani;
  public toggleStatus: boolean;
  constructor(private afAuth : AngularFireAuth,
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    private _googleMaps: GoogleMaps,
    public actionSheetCtrl: ActionSheetController) {
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
  this.initMap()    
  }

  ionViewWillLoad(){

  }
  initMap(){
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element);
  }  
  // trackNani(){
  //   console.log("initial toggle state", this.toggleStatus ) 
  //   // var db = firebase.database();    
  //   // db.ref("nani/YdSV2gxkYoO84TtnOoOjBauEJB33").update({ ava}); 
  //   if(this.toggleStatus === true){        
  //         console.log("start tracking")
  //         let flag= false;
  //         console.log("<<<<", this.nani)
  //         let naniesFix=this.nani;
  //         var Uuser = this.afAuth.auth.currentUser; 
  //         console.log("nnnnn", naniesFix, Uuser.uid);    
  //         for(var key in naniesFix){
  //           if(key===Uuser.uid){
  //             flag=true;
  //             console.log("flag true")
  //             var db = firebase.database();    
  //             db.ref("nani/"+Uuser.uid).update({ available : true});
  //           }
  //         }
  //     let that = this
  //     if(flag===true){
  //       var intervalFunc = setInterval(function timer() {
  //           that.geolocation.getCurrentPosition().then(position => {
  //             let location = new google.maps.LatLng(
  //               position.coords.latitude,
  //               position.coords.longitude
  //             );
  //             let naniLat = position.coords.latitude;
  //             let nanilng = position.coords.longitude;
  //               console.log("hereeeee",naniLat,nanilng,Uuser.uid)
  //               var db = firebase.database();    
  //               db.ref("nani/"+Uuser.uid).update({ lat: naniLat, lng:nanilng});
  //               console.log("vvvvvv",Uuser.uid,naniLat,nanilng)
                
  //           })
        
  //         }, 1000); 
  //     }
  //   }else{
  //     console.log("inside false")
  //     clearInterval(intervalFunc)
  //     var Uuser = this.afAuth.auth.currentUser;     
  //     var db = firebase.database();    
  //     db.ref("nani/"+Uuser.uid).update({ available : false});
  //   }

  // }
  information ={
    nani_id : "YdSV2gxkYoO84TtnOoOjBauEJB33" ,
    user_id : "7dfXMMQQsfN7MqpHHdYF3EBwSFX2" ,
    start_time: "7:43:16 PM"
  }

  timer(){
    this.navCtrl.push(PricePage);
  }
}




 
 

   

   