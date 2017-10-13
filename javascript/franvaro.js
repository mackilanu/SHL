//Javascript File

var Ledighetslista = new Array();
var LastDate       = '';
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


    s += '<h1 class="center-text">Ledigheter</h1>';


    MinYear  = Number(SeasonDates.MinDatum.substring(0,4));
    MaxYear  = Number(SeasonDates.MaxDatum.substring(0,4));

    MinMonth = Number(SeasonDates.MinDatum.substring(5,7));
    MaxMonth = Number(SeasonDates.MaxDatum.substring(5,7));

    if (Seasons.status == 'Error' || Userslista.status == 'Error'){
	      s += 'Vi kan tyvärr inte lämna denna information just nu på grund av oförutsedda problem.<br><br>Vid upprepade fel kontakta en administratör';
    } else {
	      s += bygg_sidan();
    }


    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function bygg_sidan(){

    LastDate = Seasons.Season[0].LastDate;

    var s = '<h4 id="lbl_rubrik" class="center-text">Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.</h4>';
    s += '<div id="container" class="text-center">';

    s += "<br>";
    s += "<div id='upperdiv'>";
    s += '<label>Välj person: &nbsp;&nbsp;</label>';
    s += '<select class="" id="cbDomare" onchange="get_info()">';
    s += '<option value="-1" selected>Välj person</option>';
    s += '<option value="0">ALLA</option>';
    for (var i = 0; i < Userslista.User.length; i++){
	      var Namn = Userslista.User[i].Domartyp + '-' + Userslista.User[i].JerseyNo + '-' + Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	      s += '<option value="' + Userslista.User[i].JerseyNo + '">' + Namn + '</option>';
    }
    s += '</select>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;<label>Säsong:&nbsp;&nbsp;</label>';
    s += '<select class="" id="cbSeason" onchange="get_info()">';
    s += "<option value='-1'>Välj säsong</option>";
    for (i = 0; i < Seasons.Season.length; i++){
	      s += '<option';
	      if (i == 0){
	          s += ' selected';
	      }
        s += ' value= ' + Seasons.Season[i].Season + '>' + Seasons.Season[i].Season + '</option>';
    }
    s += '</select>';

    s += "&nbsp;&nbsp;&nbsp;<input type='button' class='btn btn-info' onclick='tillbaka()' value='Till Mitt konto'></input>";

    s += '</div>'; // upperdiv

    s += '<div id="div_tabell"></div>';
    s += '<br><br>';

    s += '</div>'; // container

    return s;
}

function get_info(){

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


    $.getJSON("ajax/get_franvaro.php", js_objekt)
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

    Ledighetslista = response;

    if (response.status == 'Error'){
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

function visa_resten(){

    var Dagens = getDagens();

    var seasonIndex = document.getElementById("cbSeason").selectedIndex;
    seasonIndex -= 1;;

    LastDate = Seasons.Season[seasonIndex].LastDate;
    document.getElementById('lbl_rubrik').innerHTML = 'Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.';



    var s = '<table class="table">';
    s += '<caption>Totalt ' + Ledighetslista.Dag.length + ' ledigheter funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Ledig</th>';
    s += '<th>Registrerad</th>';
    s += '<th>Registrerad av</th>';
    if (seasonIndex == 0 && Dagens > LastDate){
	      s += '<th>Ta bort</th>';
    }
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (i = 0; i < Ledighetslista.Dag.length; i++){

	      s += '<tr style="cursor:default;">';
	      //Datum
	      s += '<td>' + Ledighetslista.Dag[i].Datum + '</td>';

	      //Noterad_Ledig
	      s += '<td>' +  Ledighetslista.Dag[i].Registrerat + '</td>';

	      //Noterad_Ledig av
	      s += '<td>' +  Ledighetslista.Dag[i].RegistreratAv + '</td>';

	      if (seasonIndex == 0 && Dagens > LastDate){
	          //Ta bort
	          s += '<td><button type="button" class="btn-xs btn-warning" onclick="tabort(' + String(i) + ')">Ta bort</button>';
	      }

	      s += '</tr>';

    }

    if (seasonIndex == 0 && Dagens > LastDate){
	      s += '<tr style="cursor:default;">';
	      //Datum
	      s += '<td>' + '<input type="text" id="txtDatum" maxlength="10"/></td>';

	      //Noterad_Ledig
	      s += '<td>' +  Dagens + '</td>';

	      //Noterad_Ledig av
	      s += '<td>' +  logInfo.FirstName + ', ' + logInfo.LastName + '</td>';

	      s += '<td><button type="button" class="btn-xs btn-primary" onclick="set_ledighet()">Lägg till</button>';
    }

    s += '</tbody>';
    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}

function visa_alla(){

    var Dagens = getDagens();

    var seasonIndex = document.getElementById("cbSeason").selectedIndex;
    seasonIndex -= 1;;

    LastDate = Seasons.Season[seasonIndex].LastDate;
    document.getElementById('lbl_rubrik').innerHTML = 'Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.';



    var s = '<table class="table">';
    s += '<caption>Totalt ' + Ledighetslista.Dag.length + ' ledigheter funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Namn</th>';
    s += '<th>Ledig</th>';
    s += '<th>Registrerad</th>';
    s += '<th>Registrerad av</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (i = 0; i < Ledighetslista.Dag.length; i++){

	      s += '<tr style="cursor:default;">';
	      //Namn
	      s += '<td>' + getDomare(Ledighetslista.Dag[i].JerseyNo) + '</td>';

	      //Datum
	      s += '<td>' + Ledighetslista.Dag[i].Datum + '</td>';

	      //Noterad_Ledig
	      s += '<td>' +  Ledighetslista.Dag[i].Registrerat + '</td>';

	      //Noterad_Ledig av
	      s += '<td>' +  Ledighetslista.Dag[i].RegistreratAv + '</td>';

	      s += '</tr>';

    }

    s += '</tbody>';
    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}


function tabort(i){
    var tmp = "Vill du verkligen ta bort ledigheten " + Ledighetslista.Dag[i].Datum + "?";
    if (confirm(tmp) == false) return;

    curr_JerseyNo = $("#cbDomare").val();
    curr_season = $("#cbSeason").val();



    var instring  = '{"season":' + curr_season + ', "JerseyNo":' + curr_JerseyNo  + ', ';
    instring += '"Datum": "' + Ledighetslista.Dag[i].Datum + '"}';


    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/delete_ledighet.php", js_objekt)
        .done(function(data) {
	          tabort_success(data);
	})
        .fail(function() {
	          tabort_fail();
	})
        .always(function() {

	});

}

function tabort_success(response){

    if (response.status == 'Error'){
	      alert("Borttagning av ledigheten har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");
    } else if (response.status == 'OK'){
	      get_info();
    }

}

function tabort_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function tillbaka(){
    window.location.href = "mittkonto.php";
}

function set_ledighet(){

    var NyDatum  = rensatoDB(document.getElementById('txtDatum').value.trim());
    document.getElementById('txtDatum').value = NyDatum;
    if (!NyDatum){
	      alert("Datum saknas.");
	      document.getElementById('txtDatum').focus();
	      return;
    }

    // Kontrollerar om denna datum redan finns i Legighetslista
    var Finns = false;
    for (var i = 0; i < Ledighetslista.Dag.length; ++i){
	      if (Ledighetslista.Dag[i].Datum == NyDatum){
	          Finns = true;
	          break;
	      }
    }

    if (Finns == true){
	      alert("Denna ledighetsdatum finns redan registrerad! Registreringen makuleras.");
	      return;
    }

    var Dagens = getDagens();

    // Kontrollera om datumet tillhör det förflutna!
    if (NyDatum < Dagens){
	      alert("Denna datum är redan passerad. Åtgärden makuleras.");
	      return;
    }



    curr_JerseyNo = $("#cbDomare").val();
    curr_season = $("#cbSeason").val();


    var instring  = '{"season":' + curr_season + ', "JerseyNo":' + curr_JerseyNo  + ', ';
    instring += '"Datum": "' + NyDatum + '"}';



    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/set_ledighet.php", js_objekt)
        .done(function(data) {
	          set_ledighet_success(data);
	})
        .fail(function() {
	          set_ledighet_fail();
	})
        .always(function() {

	});


}

function set_ledighet_success(response){

    if (response.status == 'Error'){
	      alert("Registrering av ledigheten har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");
    } else if (response.status == 'Tillsatt'){
	      var tmp = "Redan tillsatt att döma matchen " + response.HomeName + " - " + response.AwayName + ". Registreringen makuleras";
	      alert(tmp);
    } else if (response.status == 'OK'){
	      get_info();
    }

}

function set_ledighet_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
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

$( function() {
    $( "#txtDatum" ).datepicker( {dateFormat: 'yy-mm-dd' });
} );

