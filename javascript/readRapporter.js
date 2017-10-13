//Javascript File

var Rapportlista   = new Array();
var Rapportsvaren  = new Array();
var curr_season    = 0;
var curr_JerseyNo  = 0;


initiera();



function initiera(){

    var s = '<div class="col-md-2 col-xs-2"></div>';
    s += '<div id="c_side" class="col-md-8 col-xs-8"></div>';
    s += '<div class="col-md-2 col-xs-2"></div>';

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
    s += '<br>' + Domartyper[logInfo.Domartyp];
    if (logInfo.Priviledge != logInfo.Domartyp){
	s += ' (' + Domartyper[logInfo.Priviledge] + ')';
    }
    s += '</p>';

    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';


    s += '<h1 class="center-text">Läs coachrapporter</h1>';
    s += '<br>';

    s += '<div class="form-group text-center">';


    if (Seasons.status == 'Error' || Userslista.status == 'Error'){
	      s += 'Vi kan tyvärr inte lämna denna information just nu på grund av oförutsedda problem.<br><br>Vid upprepade fel kontakta webbmaster';
    } else {
	      s += bygg_sidan();
    }

    s += '</div>';

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}


function bygg_sidan(){

    var s = '<div id="container" class="text-center">';

    s += "<br>";
    s += "<div id='upperdiv'>";

    var s = '<label>Välj person:&nbsp;&nbsp;</label>';
    s += '<select class="" id="cbDomare" onchange="get_info()">';
    s += '<option value="-1" selected>Välj person</option>';
    s += '<option value="0">ALLA</option>';
    for (var i = 0; i < Userslista.User.length; i++){
	      var Namn = Userslista.User[i].Domartyp + '-' + Userslista.User[i].JerseyNo + '-' + Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	      s += '<option value="' + Userslista.User[i].JerseyNo + '">' + Namn + '</option>';
    }
    s += '</select>';


    s += '&nbsp;&nbsp;&nbsp;&nbsp;<label>Välj säsong:&nbsp;&nbsp;</label>';
    s += '<select class="" id="cbSeason" onchange="get_info()">';
    s += '<option>Välj säsong</option>';
    for (i = 0; i < Seasons.Season.length; i++){
	      if (i == 0){
	          s += '<option selected>' + Seasons.Season[i].Season + '</option>';
	      } else {
	          s += '<option>' + Seasons.Season[i].Season + '</option>';
	      }
    }
    s += '</select>';
    s += "&nbsp;&nbsp;&nbsp;<input type='button' class='btn btn-info' onclick='tillbaka()' value='Till Mitt konto'></input>";

    /*
    // Rapporten
    s += '<br><br>';
    s += '<label id="rapportrubrik">Matchrapport</label>';
    s += '<div class="well text-left" id="div_rapport"></div>';
*/
    s += '</div>'; // upperdiv

    s += '<div id="div_tabell"></div>';
    s += '<br><br>';

    s += '</div>'; // container

    return s;
}


function get_info(){

    //document.getElementById('rapportrubrik').innerHTML = 'Matchrapport';
    //document.getElementById('div_rapport').innerHTML = '';


    // Domare
    curr_JerseyNo = $("#cbDomare").val();
    if (curr_JerseyNo == -1){
	      rensa_tabell();
	      return;
    }

    // Säsong
    curr_season = $("#cbSeason").val();
    if (curr_season == -1){
	      rensa_tabell();
	      return;
    }


    var instring  = '{"season":' + curr_season + ', "JerseyNo":' + curr_JerseyNo   + '}';


    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/rapporter.php", js_objekt)
        .done(function(data) {
	          get_info_success(data);
	})
        .fail(function() {
	          get_info_fail();
	})
        .always(function() {

	});

}

function get_info_success(response){

    Rapportlista = response;

    if (Rapportlista.status == 'Error'){
	      alert("Läsning av information har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");
    } else {
        if (curr_JerseyNo > 0 ){
	          visa_resten();
        } else {
            visa_alla();
        }
    }

}

function get_info_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function tillbaka(){
    window.location.href = "mittkonto.php";
}

function visa_resten(){
    var s = '<div id="myModal" class="modal">';
    // Modal content
    s += '<div class="modal-content">';

    s += '<div class="modal-header">';
    //s += '<span class="close">&times;</span>';
    s += '<h4>refmanagment</h4>';
    s += '<h5>T. Pavlidis - NitsaSoft in Sweden AB</h5>';
    s += '</div>';

    s += '<div id="div_modal_body" class="modal-body">';
    s += '</div>';

    s += '<div class="modal-footer">';
    s += '<h5>Marcus Andresson - IT gymnasiet i Karlstad</h5>';
    s += '</div>';

    s += '</div>';
    s += '</div>';


    s += '<table class="table">';
    s += '<caption>Totalt <b>' + Rapportlista.Rapport.length + '</b> rapporter funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Game</th>';
    s += '<th>Arena</th>';
    s += '<th>Betyg</th>';
    s += '<th>Rapport</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (var i = 0; i < Rapportlista.Rapport.length; i++){

	      s += '<tr style="cursor:default;">';

	      // Datum
	      var tmp = String(Rapportlista.Rapport[i].Date).substring(0,16);
	      s += '<td class="text-left">' + tmp + '</td>';

	      // Game
	      tmp = Rapportlista.Rapport[i].HomeCode + ' - ' + Rapportlista.Rapport[i].AwayCode;
	      var thistitel = Rapportlista.Rapport[i].HomeName + ' - ' + Rapportlista.Rapport[i].AwayName;
	      s += '<td class="// TODO: ext-left" title="' + thistitel + '">' + tmp + '</td>';

	      // Arena
	      s += '<td class="text-left">' + Rapportlista.Rapport[i].Arena + '</td>';

	      // Betyg
	      s += '<td class="text-left">' + Rapportlista.Rapport[i].Betyg + '</td>';

	      // Rapport
	      s += '<td id="cell' + String(i) + '"><button type="button" id="knapp' + String(i) + '" class="';
	      s += 'btn-xs btn-primary';
	      s += '" onclick="visa_rapport(' + String(i) + ')"';
	      s += '>Visa</button></td>';
	      s += '</tr>';

    }

    s += '</tbody>';

    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}

function visa_alla(){
    var s = '<div id="myModal" class="modal">';
    // Modal content
    s += '<div class="modal-content">';

    s += '<div class="modal-header">';
    //s += '<span class="close">&times;</span>';
    s += '<h4>refmanagment</h4>';
    s += '<h5>T. Pavlidis - NitsaSoft in Sweden AB</h5>';
    s += '</div>';

    s += '<div id="div_modal_body" class="modal-body">';
    s += '</div>';

    s += '<div class="modal-footer">';
    s += '<h5>Marcus Andresson - IT gymnasiet i Karlstad</h5>';
    s += '</div>';

    s += '</div>';
    s += '</div>';


    s += '<table class="table">';
    s += '<caption>Totalt <b>' + Rapportlista.Rapport.length + '</b> rapporter funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Namn</th>';
    s += '<th>Datum</th>';
    s += '<th>Game</th>';
    s += '<th>Arena</th>';
    s += '<th>Betyg</th>';
    s += '<th>Rapport</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (var i = 0; i < Rapportlista.Rapport.length; i++){

	      s += '<tr style="cursor:default;">';

	      //Namn
	      s += '<td>' + getDomare(Rapportlista.Rapport[i].JerseyNo) + '</td>';

	      // Datum
	      var tmp = String(Rapportlista.Rapport[i].Date).substring(0,16);
	      s += '<td class="text-left">' + tmp + '</td>';

	      // Game
	      tmp = Rapportlista.Rapport[i].HomeCode + ' - ' + Rapportlista.Rapport[i].AwayCode;
	      var thistitel = Rapportlista.Rapport[i].HomeName + ' - ' + Rapportlista.Rapport[i].AwayName;
	      s += '<td class="text-left" title="' + thistitel + '">' + tmp + '</td>';

	      // Arena
	      s += '<td class="text-left">' + Rapportlista.Rapport[i].Arena + '</td>';

	      // Betyg
	      s += '<td class="text-left">' + Rapportlista.Rapport[i].Betyg + '</td>';

	      // Rapport
	      s += '<td id="cell' + String(i) + '"><button type="button" class="';
	      s += 'btn-xs btn-primary';
	      s += '" onclick="visa_rapport(' + String(i) + ')"';
	      s += '>Visa</button></td>';
	      s += '</tr>';

    }

    s += '</tbody>';

    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}

function visa_rapport(rad){

    var instring  = '{"season":'   + curr_season   + ', ';
    if (curr_JerseyNo != 0){
        instring     += '"JerseyNo":'  + curr_JerseyNo + ', ';
    } else {
        instring     += '"JerseyNo":'  + Rapportlista.Rapport[rad].JerseyNo + ', ';
    }
    instring     += '"GameId":'    + Rapportlista.Rapport[rad].GameId + '}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/hamta_rapport.php", js_objekt)
        .done(function(data) {
	          visa_rapport_success(data,rad);
	})
        .fail(function() {
	          visa_rapport_fail();
	})
        .always(function() {

	});

}


function visa_rapport_success(response,rad){

    Rapportsvaren = response;

    if (Rapportsvaren.status == 'Error'){
	      alert("Hämtning av rapporten har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (Rapportsvaren.status == 'OK'){
	      visa_rapporten(rad);
    } else {
	      alert("Oförutsett fel har inträffat!");
    }
}


function visa_rapporten(rad){
    // When the user clicks the button, open the modal
    // Get the modal

    var s = '<h4>Matchrapport för matchen ' + Rapportlista.Rapport[rad].HomeName + '-' + Rapportlista.Rapport[rad].AwayName + ' den ' + String(Rapportlista.Rapport[rad].Date).substring(0,16) + '</h4>';

    for (i = 0; i < Rapportlista.Query.length; ++i){
	      s += '<b>' + Rapportlista.Query[i].Query + '</b>';
	      s += '<br>' + Rapportsvaren.Answer[i].Answer;
	      s += '<br><br>';
    }


    s += '<button type="button" class="btn btn-primary" onclick="doljRapport()">Dölj rapport</button>';

    document.getElementById('div_modal_body').innerHTML = s;

    var tmp = 'Matchrapport för matchen ' + Rapportlista.Rapport[rad].HomeName + '-' + Rapportlista.Rapport[rad].AwayName + ' den ' + String(Rapportlista.Rapport[rad].Date).substring(0,16);

    //document.getElementById('rapportrubrik').innerHTML = tmp;




    modal = document.getElementById('myModal');


    // Get the button that opens the modal
    var tmp = 'knapp' + rad;
    btn = document.getElementById(tmp);

    modal.style.display = "block";

}

function visa_rapport_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");

}

function doljRapport(){
    modal.style.display = "none";

    //document.getElementById('rapportrubrik').innerHTML = 'Matchrapport';
    //document.getElementById('div_rapport').innerHTML = '';
}

function rensa_tabell(){
    document.getElementById('div_tabell').innerHTML = '';
}


function getDomare(JerseyNo){

    for (var i = 0; i < Userslista.User.length; i++){
        if (Userslista.User[i].JerseyNo == JerseyNo){
	          var Namn = Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
            return  Namn;
        }
    }

    return '';
}
