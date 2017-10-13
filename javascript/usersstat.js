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

    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

    sortASC = true;
    sorteraTroja();
    visa_tabell();
}

function visa_tabell(){

    var s = '<h1 class="center-text">Domarstatistik</h1>';
    s += '<br>';

    s += '<div class="class="main-content" style="margin: auto 2%;">';
    s += '<table class="table">';
    s += '<caption>Totalt ' + Userslista.User.length + ' konton funna';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button>';
    s += '</caption>' ;

    s += '<thead>';
    s += '<tr>';
    s += '<th style="cursor:pointer;" onclick="sorteraTroja()">Tröjnr</th>';
    s += '<th style="text-align:left">Aktiv</th>';
    s += '<th style="cursor:pointer; text-align:left;" onclick="sorteraDomartyp()">Domartyp</th>';
    s += '<th style="cursor:pointer; text-align:left;" onclick="sorteraNamn()">Namn</th>';
    s += '<th style="cursor:pointer; text-align:left;" onclick="sorteraGrundspel()">Grundspel</th>';
    s += '<th style="cursor:pointer; text-align:left;" onclick="sorteraSlutspel()">Slutspel</th>';
    s += '<th style="cursor:pointer; text-align:left;" onclick="sorteraTotalt()">Totalt</th>';
    s += '<th>Detaljer</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    if (Userslista.status == "OK"){
	      for (var i = 0; i < Userslista.User.length; i++){
	          s += '<tr style="cursor:default;">';

            // JerseyNo
	          s += '<td>' + Userslista.User[i].JerseyNo + '</td>';

            // Active
	          s += '<td>';
	          if (Userslista.User[i].Active == 'J'){
		            s += 'Ja';
	          } else {
		            s += 'Nej';
	          }
	          s += '</td>';

            // Domartyp
	          s += '<td>' + Domartyper[Userslista.User[i].Domartyp] + '</td>';

            // Namn
	          var Namn = Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	          s += '<td>' + Namn + '</td>';

            // Grundspel
	          var Grundspel = Userslista.User[i].DomdaGrundspel + Userslista.User[i].grundspelcount;
	          s += '<td style="text-align:left">' + Grundspel + '</td>';

            // Slutspel
	          var Slutspel = Userslista.User[i].DomdaSlutspel + Userslista.User[i].slutspelcount;
	          s += '<td style="text-align:left">' + Slutspel + '</td>';

            // Totalt
	          var Totalt = Grundspel + Slutspel;
	          s += '<td style="text-align:left">' + Totalt + '</td>';

            // Detaljer
	          s += '<td style="cursor:pointer;text-align:left" onclick="visainfo(' + String(i) + ')">Detaljer</td>';
	          s += '</tr>';
	      }
    }
    s += '</tbody>';
    s += '</table>';

    s += '<br>';

    s += '<div class="text-center">';
    s += '<button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('div_tabell').innerHTML = s;

}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}


function visainfo(i){
    var url='userstat.php?JNO=' + Userslista.User[i].JerseyNo;
    url += '&GI=' + Userslista.User[i].DomdaGrundspel;
    url += '&SI=' + Userslista.User[i].DomdaSlutspel;
    url += '&FN=' + Userslista.User[i].FirstName;
    url += '&LN=' + Userslista.User[i].LastName;

    window.open(url, '_self');
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


function sorteraGrundspel(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
	              var Grundspel_i = Number(Userslista.User[i].DomdaGrundspel) + Number(Userslista.User[i].grundspelcount);
	              var Grundspel_j = Number(Userslista.User[j].DomdaGrundspel) + Number(Userslista.User[j].grundspelcount);
                if (Grundspel_i > Grundspel_j){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
	              Grundspel_i = Number(Userslista.User[i].DomdaGrundspel) + Number(Userslista.User[i].grundspelcount);
	              Grundspel_j = Number(Userslista.User[j].DomdaGrundspel) + Number(Userslista.User[j].grundspelcount);
                if (Grundspel_i < Grundspel_j){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    }

    visa_tabell();
}


function sorteraSlutspel(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
	              var Slutspel_i = Number(Userslista.User[i].DomdaSlutspel) + Number(Userslista.User[i].slutspelcount);
	              var Slutspel_j = Number(Userslista.User[j].DomdaSlutspel) + Number(Userslista.User[j].slutspelcount);
                if (Slutspel_i > Slutspel_j){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
	              Slutspel_i = Number(Userslista.User[i].DomdaSlutspel) + Number(Userslista.User[i].slutspelcount);
	              Slutspel_j = Number(Userslista.User[j].DomdaSlutspel) + Number(Userslista.User[j].slutspelcount);
                if (Slutspel_i > Slutspel_j){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    }

    visa_tabell();
}

function sorteraTotalt(){
    if (Userslista.status != "OK") return;

    if (Userslista.User.length < 2) return;


    if (sortASC == true){
        sortASC = false;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
	              var Grundspel_i = Number(Userslista.User[i].DomdaGrundspel) + Number(Userslista.User[i].grundspelcount);
	              var Grundspel_j = Number(Userslista.User[j].DomdaGrundspel) + Number(Userslista.User[j].grundspelcount);
	              var Slutspel_i = Number(Userslista.User[i].DomdaSlutspel) + Number(Userslista.User[i].slutspelcount);
	              var Slutspel_j = Number(Userslista.User[j].DomdaSlutspel) + Number(Userslista.User[j].slutspelcount);
                var Totalt_i = Grundspel_i + Slutspel_i;
                var Totalt_j = Grundspel_j + Slutspel_j;
                if (Totalt_i > Totalt_j){
                    // Byt plats
                    bytplats(i,j);
                }
            }
        }
    } else {
        sortASC = true;
	      for (var i = 0; i < Userslista.User.length - 1; i++){
	          for (var j = i + 1; j < Userslista.User.length; j++){
	              Grundspel_i = Number(Userslista.User[i].DomdaGrundspel) + Number(Userslista.User[i].grundspelcount);
	              Grundspel_j = Number(Userslista.User[j].DomdaGrundspel) + Number(Userslista.User[j].grundspelcount);
	              Slutspel_i = Number(Userslista.User[i].DomdaSlutspel) + Number(Userslista.User[i].slutspelcount);
	              Slutspel_j = Number(Userslista.User[j].DomdaSlutspel) + Number(Userslista.User[j].slutspelcount);
                Totalt_i = Grundspel_i + Slutspel_i;
                Totalt_j = Grundspel_j + Slutspel_j;
                if (Totalt_i < Totalt_j){
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
    // DomdaGrundspel
    x = Userslista.User[i].DomdaGrundspel;
    Userslista.User[i].DomdaGrundspel = Userslista.User[j].DomdaGrundspel;
    Userslista.User[j].DomdaGrundspel = x;
    // grundspelcount
    x = Userslista.User[i].grundspelcount;
    Userslista.User[i].grundspelcount = Userslista.User[j].grundspelcount;
    Userslista.User[j].grundspelcount = x;
    // slutspelcount
    x = Userslista.User[i].slutspelcount;
    Userslista.User[i].slutspelcount = Userslista.User[j].slutspelcount;
    Userslista.User[j].slutspelcount = x;
    // DomdaSlutspel
    x = Userslista.User[i].DomdaSlutspel;
    Userslista.User[i].DomdaSlutspel = Userslista.User[j].DomdaSlutspel;
    Userslista.User[j].DomdaSlutspel = x;
    // FirstName
    x = Userslista.User[i].FirstName;
    Userslista.User[i].FirstName = Userslista.User[j].FirstName;
    Userslista.User[j].FirstName = x;
    // LastName
    x = Userslista.User[i].LastName;
    Userslista.User[i].LastName = Userslista.User[j].LastName;
    Userslista.User[j].LastName = x;

}
