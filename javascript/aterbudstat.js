//Javascript File

var Aterbudslista = new Array();
var LastDate      = '';


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


    s += '<h1 class="center-text">Återbudstatistik</h1>';

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

    LastDate = Seasons.Season[0].LastDate;

    var s = '<h4 id="lbl_rubrik" class="center-text">Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.</h4>';
    s += '<div class="text-center">';

    s += "<br>";
    s += "<div id='upperdiv'>";

    s += '<label>Välj person:&nbsp;&nbsp;</label>';
    s += '<select class="" id="cbDomare" onchange="get_info()">';
    s += '<option value="-1" selected>Välj person</option>';
    for (var i = 0; i < Userslista.User.length; i++){
	      var Namn = Userslista.User[i].Domartyp + '-' + Userslista.User[i].JerseyNo + '-' + Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	      s += '<option value="' + Userslista.User[i].JerseyNo + '">' + Namn + '</option>';
    }
    s += '</select>';


    s += '&nbsp;&nbsp;&nbsp;&nbsp;<label>Välj säsong:&nbsp;&nbsp;</label>';
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

    s += '<div id="div_tabell"></div>';
    s += '<br><br>';
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
    console.log(instring);
    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/aterbudstat.php", js_objekt)
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

    Aterbudslista = response;

    if (Aterbudslista.status == 'Error'){
	      alert("Läsning av information har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");
    } else {
	      visa_resten();
    }

}

function get_info_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function tillbaka(){
    window.location.href = "mittkonto.php";
}


function visa_resten(){

    var seasonIndex = document.getElementById("cbSeason").selectedIndex;
    seasonIndex -= 1;;

    LastDate = Seasons.Season[seasonIndex].LastDate;
    document.getElementById('lbl_rubrik').innerHTML = 'Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.';

    var s = '<table class="table">';
    s += '<caption>Totalt ' + Aterbudslista.Dag.length + ' återbud funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Game</th>';
    s += '<th>Arena</th>';
    s += '<th>Registrerad</th>';
    s += '<th>GameType</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (var i = 0; i < Aterbudslista.Dag.length; i++){

	      s += '<tr style="cursor:default;">';

	      // Datum
	      s += '<td>' + Aterbudslista.Dag[i].Date + '</td>';

	      // Game
	      var tmp = Aterbudslista.Dag[i].HomeCode + ' - ' + Aterbudslista.Dag[i].AwayCode;
	      var thistitel = Aterbudslista.Dag[i].HomeName + ' - ' + Aterbudslista.Dag[i].AwayName;
	      s += '<td title="' + thistitel + '">' + tmp + '</td>';

	      // Arena
	      s += '<td>' + Aterbudslista.Dag[i].Arena + '</td>';

	      // Registrerad
	      thistitel = Aterbudslista.Dag[i].Registrerat_Av;
	      s += '<td title="' + thistitel + '">' + Aterbudslista.Dag[i].Registrerat + '</td>';

	      // GameType
	      if (!Aterbudslista.Dag[i].Level){
	          thistitel = 'Uppgift saknas';
	      } else {
	          thistitel = Aterbudslista.Dag[i].Level;
	      }
	      s += '<td title="' + thistitel + '">' + Aterbudslista.Dag[i].GameType + '</td>';

	      s += '</tr>';

    }

    s += '</tbody>';

    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}

function rensa_tabell(){
    document.getElementById('div_tabell').innerHTML = '';
}
