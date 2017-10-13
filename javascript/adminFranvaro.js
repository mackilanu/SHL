//Javascript File

var Ledighetslista = new Array();
var LastDate       = '';
var curr_season    = 0;
var curr_month     = 0;


initiera();


function initiera(){

    var s = '<div class="col-md-2 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-8 col-xs-12"></div>';
    s += '<div class="col-md-2 col-xs-0"></div>';

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


    s += '<h1 class="center-text">Min ledighet</h1>';


    MinYear  = Number(SeasonDates.MinDatum.substring(0,4));
    MaxYear  = Number(SeasonDates.MaxDatum.substring(0,4));

    MinMonth = Number(SeasonDates.MinDatum.substring(5,7));
    MaxMonth = Number(SeasonDates.MaxDatum.substring(5,7));

    if (Seasons.status == 'Error'){
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
    s += '<div class="text-center">';

    s += "<br>";
    s += "<div id='upperdiv'>";
    s += '<label>Månad :&nbsp;&nbsp;</label>';
    s += "<select id='cbMonth' onchange='SendMonthValue()'  class=''>";
    s += "<option value='-1' selected='selected'>Välj månad </option>";
    s += "<option value='0'>" + manader[0] + "</option>";

    if (MinYear == MaxYear){
        for (var i = MinMonth; i <= MaxMonth; ++i){
            s += "<option value='" + String(i) + "'>" + manader[i] + "</option>";
        }
    } else {
        for (i = MinMonth; i <= 12; ++i){
            s += "<option value='" + String(i) + "'>" + manader[i] + "</option>";
        }
        for (i = 1; i <= MaxMonth; ++i){
            s += "<option value='" + String(i) + "'>" + manader[i] + "</option>";
        }
    }

    s += "</select>";

    s += '&nbsp;&nbsp;&nbsp;&nbsp;<label>Säsong:&nbsp;&nbsp;</label>';
    s += '<select class="" id="cbSeason" onchange="SendMonthValue()">';
    s += "<option value='-1'>Välj säsong</option>";
    for (i = 0; i < Seasons.Season.length; i++){
	      s += '<option';
	      if (i == 0){
	          s += ' selected';
	      }
        s += ' value= ' + Seasons.Season[i].Season + '>' + Seasons.Season[i].Season + '</option>';
    }
    s += '</select>';

    s += "&nbsp;&nbsp;&nbsp;<input type='button' class='btn btn-info' onclick='mittkonto()' value='Till mitt konto'></input>";
    s += '<br><br>';
    s += "</div>";

    s += '</div>';

    s += '<div id="div_tabell"></div>';
    return s;

}

function SendMonthValue(){
    curr_month = $("#cbMonth").val();
    if (curr_month == -1){
	      rensa_tabell();
	      return;
    }

    curr_season = $("#cbSeason").val();
    if (curr_season == -1){
	      rensa_tabell();
	      return;
    }


    var instring  = '{"Season": ' + curr_season + ', "month": ' + curr_month  +'}';

    var objekt = JSON.parse(instring);


    $.getJSON( "ajax/adminFranvaro.php", objekt)
        .done(function(data) {
            SendMonth_success(data);

	})
        .fail(function() {
        SendMonth_fail();
	})
        .always(function() {

	});

}


function SendMonth_success(response){

    Ledighetslista = response;

    if (Ledighetslista.status == "Error"){
	      alert("På grund av ett oförutsedd fel har informationen inte kunnat hämtas! Om problemet kvarstår kontakta administratörern");
    } else if (Ledighetslista.status == "OK"){
	      fyll_tabellen();
    } else {
	      alert("Oförutsedd fel! Om problemet kvårstår kontakta administratörern");
    }
}

function fyll_tabellen(){

    if (curr_month == 0){
        rensa_tabell();
        alert("Vi ber att få återkomma med denna rutin. Hav tålamod!");
        return;
    }



    var i = document.getElementById("cbSeason").selectedIndex;
    i -= 1;
    LastDate = Seasons.Season[i].LastDate;
    document.getElementById('lbl_rubrik').innerHTML = 'Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.';

    var Dagens = getDagens();

    var s = '<table class="table">';
    s += '<caption>Totalt ' + Ledighetslista.Dag.length + ' ledigheter funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Ledig</th>';
    s += '<th>Registrerat</th>';
    s += '<th>Registrerat av</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';


    if(curr_month >= MinMonth){
        year = MinYear;
    } else {
        year = MaxYear;
    }

    if (leapYear(year)) dagar[2] = 29;



    for (var i = 1; i <= dagar[curr_month]; i++){

        var d = new Date();
        d.setFullYear(year);
        d.setMonth(curr_month - 1);
        d.setDate(i);

	      var tmp = getVeckodag(d);
	      s += '<tr style="background: ';
	      if (tmp == 'Sön'){
	          s += '#f87881';
	      } else {
	          s += 'white';
	      }
	      s += '">';
	      s += '<td><b>' + tmp + '</b> ' + d.toISOString().slice(0,10) + '</td>';
        var curr_date = d.toISOString().slice(0,10);
	      s += '<td><input type="checkbox" id="cbDatum_' + String(i) + '" onchange="changeledighet(' + "'" + String(i) + "', " + "'" + curr_date + "'" + ')"';
        if (ledighetFinns(d.toISOString().slice(0,10))){
            s += ' checked';
        }

	      if (Dagens > LastDate ){
	          s += ' disabled';
	      } else if (ledighetFinns(d.toISOString().slice(0,10))){
	          if (d.toISOString().slice(0,10) < Dagens){
	              s += ' disabled';
	          }
        }
	      s += '>';
	      s += '</td>';


	      s += '<td>';
	      s += getRegistrerat(d.toISOString().slice(0,10));
	      s += '</td>';

	      s += '<td>';
	      s += getRegistreratAv(d.toISOString().slice(0,10));
	      s += '</td>';

	      s += '</tr>';
    }

    s += '</tbody>';
    s += '</table>';

    s += '<div class="text-center"><button class="btn btn-info" onclick="mittkonto()">Till mitt konto</button></div><br><br>';

    document.getElementById('div_tabell').innerHTML = s;

}

function SendMonth_fail(){
    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


function rensa_tabell(){
    document.getElementById('div_tabell').innerHTML = '';
}

function changeledighet(i,datum){
    var id='cbDatum_' + String(i);
    var action = 'delete';
    if (document.getElementById(id).checked){
        action = 'insert';
    }
    var instring  = '{"season": ' + curr_season + ', "datum": "' + datum  +'", "action": "' + action + '"}';
    var objekt = JSON.parse(instring);


    $.getJSON( "ajax/update_ledighet.php", objekt)
        .done(function(data) {
	          changeledighet_success(data);
	})
        .fail(function() {
            changeledighet_fail();
	})
        .always(function() {

	});

}

function changeledighet_success(response){

    if (response.status == 'Error'){
	      alert("Uppdateringen av ledigheten har misslyckats. Åtgärden makuleras. Vid upprepande misslyckanden kontakta administratören.");
    } else if (response.status == 'Tillsatt'){
	      var tmp = 'Denna dag är du redan tillsatt att döma matchen ' + response.HomeName + ' - ' + response.AwayName + '. Kontakta administratör för assistans. Åtgärden makuleras.';
	      alert(tmp);
	      SendMonthValue();
    } else if (response.status == 'OK' || response.status == 'Deleted'){
	      SendMonthValue();
    } else {
	      alert("Oförutsett fel. Vid upprepande fel kontakta administratören.");
    }
}

function changeledighet_fail(){
    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function ledighetFinns(datum){

    for (var i = 0; i < Ledighetslista.Dag.length; ++i){
        if (datum == Ledighetslista.Dag[i].Datum){
            return true;
        }
    }
    return false;
}

function getRegistrerat(datum){
    for (var i = 0; i < Ledighetslista.Dag.length; ++i){
        if (datum == Ledighetslista.Dag[i].Datum){
            return Ledighetslista.Dag[i].Registrerat;
        }
    }
    return '';
}


function getRegistreratAv(datum){
    for (var i = 0; i < Ledighetslista.Dag.length; ++i){
        if (datum == Ledighetslista.Dag[i].Datum){
            return Ledighetslista.Dag[i].RegistreratAv;
        }
    }
    return '';
}

function mittkonto(){
    window.location.href = "mittkonto.php";
}
