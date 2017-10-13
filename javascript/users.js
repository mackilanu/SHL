//Javascript File

var sortASC = true;

initiera();


function initiera(){

    var s = '<div class="col-md-0 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-12 col-xs-12"></div>';
    s += '<div class="col-md-0 col-xs-0"></div>';

    document.getElementById('div_container').innerHTML = s;

    visa_sidan();
    visa_foten();
}


function visa_sidan(){

    var s = '<div class="col-md-6 col-xs-6 right-header">';
    s += '<a href="mittkonto.php"><img src="Images/SHL-logo.jpg" alt="SHL" class="logo" style="width:80%;"></a></div>';


    s += '<div class="col-md-6 col-xs-6 left-header">';
    logInfo = JSON.parse(logInfo);
    s += '<p id="inloggadsom" class="text-right">';
    s += logInfo.JerseyNo + '-' + logInfo.FirstName + ', ' + logInfo.LastName;
    s += '<br>' + Domartyper[logInfo.Domartyp] + '</p>';
    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';

    s += '<div id="div_tabell"></div>';

    document.getElementById('c_side').innerHTML = s;

    sortASC = true;
    sorteraTroja();
    visa_tabell();
}

function visa_tabell(){

    var s = '<h1 class="center-text">Användarkonton</h1>';
    s += '<br>';

    s += '<div class="class="main-content" style="margin: auto 2%;">';
    s += '<table class="table">';
    s += '<caption>Totalt ' + Userslista.User.length + ' konton funna' ;
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button>';
    s += '</caption>' ;

    s += '<thead>';
    s += '<tr>';
    s += '<th style="cursor:pointer;" onclick="sorteraTroja()" >Tröjnr</th>';
    s += '<th>Aktiv</th>';
    s += '<th style="cursor:pointer;" onclick="sorteraDomartyp()">Domartyp</th>';
    s += '<th style="cursor:pointer;" onclick="sorteraPriviledge()">Behörighet</th>';
    s += '<th style="cursor:pointer;" onclick="sorteraNamn()">Namn</th>';
    s += '<th>Visa/ändra</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    if (Userslista.status == "OK"){
	      for (var i = 0; i < Userslista.User.length; i++){
	          s += '<tr style="cursor:default;">';
	          s += '<td>' + Userslista.User[i].JerseyNo + '</td>';
	          s += '<td>';
	          if (Userslista.User[i].Active == 'J'){
		            s += 'Ja';
	          } else {
		            s += 'Nej';
	          }
	          s += '</td>';
	          s += '<td>' + Domartyper[Userslista.User[i].Domartyp] + '</td>';
	          s += '<td>' + Domartyper[Userslista.User[i].Priviledge] + '</td>';
	          var Namn = Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	          s += '<td>' + Namn + '</td>';
	          s += '<td style="cursor:pointer;" onclick="visainfo(' + String(i) + ')">visa/ändra</td>';
	          s += '</tr>';
	      }
    }
    s += '</tbody>';
    s += '</table>';

    s += '<br>';

    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="add_user()">Lägg till konto</button>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('div_tabell').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}

function visainfo(i){
    var url='update_user.php?JNO=' + Userslista.User[i].JerseyNo;
    window.open(url, '_self');
}

function add_user(){
    window.open('adduser.php', '_self');
}

function sorteraTroja(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Number(Userslista.User[i].JerseyNo) > Number(Userslista.User[j].JerseyNo)){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Number(Userslista.User[i].JerseyNo) < Number(Userslista.User[j].JerseyNo)){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    }

    visa_tabell();
}

function sorteraNamn(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Userslista.User[i].LastName > Userslista.User[j].LastName){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Userslista.User[i].LastName < Userslista.User[j].LastName){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    }

    visa_tabell();

}

function sorteraDomartyp(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Number(Userslista.User[i].Domartyp) > Number(Userslista.User[j].Domartyp)){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Number(Userslista.User[i].Domartyp) < Number(Userslista.User[j].Domartyp)){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    }

    visa_tabell();
}

function sorteraPriviledge(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Number(Userslista.User[i].Priviledge) > Number(Userslista.User[j].Priviledge)){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
                if (Number(Userslista.User[i].Priviledge) < Number(Userslista.User[j].Priviledge)){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    }

    visa_tabell();
}

function bytplats(i,j){

    // JerseyNo
    var x = Userslista.User[i].JerseyNo;
    Userslista.User[i].JerseyNo = Userslista.User[j].JerseyNo;
    Userslista.User[j].JerseyNo = x;
    // Active
    x = Userslista.User[i].Active;
    Userslista.User[i].Active = Userslista.User[j].Active;
    Userslista.User[j].Active = x;
    // Domartyp
    x = Userslista.User[i].Domartyp;
    Userslista.User[i].Domartyp = Userslista.User[j].Domartyp;
    Userslista.User[j].Domartyp = x;
    // Priviledge
    x = Userslista.User[i].Priviledge;
    Userslista.User[i].Priviledge = Userslista.User[j].Priviledge;
    Userslista.User[j].Priviledge = x;
    // FirstName
    x = Userslista.User[i].FirstName;
    Userslista.User[i].FirstName = Userslista.User[j].FirstName;
    Userslista.User[j].FirstName = x;
    // LastName
    x = Userslista.User[i].LastName;
    Userslista.User[i].LastName = Userslista.User[j].LastName;
    Userslista.User[j].LastName = x;

}
