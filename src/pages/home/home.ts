import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth"


declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  constructor(private afAuth : AngularFireAuth,
    public navCtrl: NavController) {

  }
  
  logout(){
     this.afAuth.auth.signOut()  
  this.navCtrl.setRoot(HomePage) 
  }

  ionViewWillLoad(){
    
  }
 
    
 

}



 
 

   

   