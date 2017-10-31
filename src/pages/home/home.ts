import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth"
import { LoginPage } from '../login/login'
import { AngularFireDatabase } from "angularfire2/database";
import firebase from 'firebase';

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  nani;
  public toggleStatus: boolean;
  constructor(private afAuth : AngularFireAuth,
    public navCtrl: NavController,
    public db: AngularFireDatabase) {
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

  ionViewWillLoad(){
  
  }
     
trackNani(){
  console.log("initial toggle state", this.toggleStatus ) 
  // var db = firebase.database();    
  // db.ref("nani/YdSV2gxkYoO84TtnOoOjBauEJB33").update({ ava}); 
  if(this.toggleStatus === true){        
        console.log("start tracking")
        let flag= false;
        console.log("<<<<", this.nani)
        let naniesFix=this.nani;
        var Uuser = this.afAuth.auth.currentUser; 
        console.log("nnnnn", naniesFix, Uuser.uid);    
        for(var key in naniesFix){
          if(key===Uuser.uid){
            flag=true;
            console.log("flag true")
            var db = firebase.database();    
            db.ref("nani/"+Uuser.uid).update({ available : true});
          }
        }
    let that = this
    if(flag===true){
      var intervalFunc = setInterval(function timer() {
          that.geolocation.getCurrentPosition().then(position => {
            let location = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            let naniLat = position.coords.latitude;
            let nanilng = position.coords.longitude;
              console.log("hereeeee",naniLat,nanilng,Uuser.uid)
              var db = firebase.database();    
              db.ref("nani/"+Uuser.uid).update({ lat: naniLat, lng:nanilng});
              console.log("vvvvvv",Uuser.uid,naniLat,nanilng)
              
          })
      
        }, 1000); 
    }
  }else{
    console.log("inside false")
    clearInterval(intervalFunc)
    var Uuser = this.afAuth.auth.currentUser;     
    var db = firebase.database();    
    db.ref("nani/"+Uuser.uid).update({ available : false});
  }

}
    
 

}



 
 

   

   