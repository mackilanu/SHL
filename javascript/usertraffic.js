//Javascript File

var Inlogningar   = new Array();
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
    s += '<br>' + Domartyper[logInfo.Domartyp] + '</p>';
    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';


    s += '<h1 class="center-text">Användarinloggningar</h1>';
    s += '<br>';

    s += '<div class="class="main-content" style="margin: auto 2%;">';


    if (Userslista.status == "Error"){
	      s += 'Ett fel har uppstått. Användarinloggningar har inte kunnat läsas in. Vid uppreppade fel kontakta webbtjänstansvarig.';
    } else if (Userslista.User.length < 1){
	      s += 'Användarlistan är tom!. Användarinloggningar kan inte visas.';
    } else {
	      s  += '<label>Visa användare:</label>';
	      s += '&nbsp;&nbsp;';
	      s += '<select id="cbUser" onchange="bytUser()">';
	      s += '<option value="-1">Välj användare</option>';
	      s += '<option value="0">ALLA</option>';
	      for (var i = 0; i < Userslista.User.length; ++i){
	          var Namn = Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	          s += '<option value="' + Userslista.User[i].JerseyNo + '">'  + Namn + '</option>';
	      }
	      s += '</select>';
    }
    s += '&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="tillbaka()">Till mitt konto</button>';
    s += '<br><br>';

    s += '<div id="div_result"></div>';

    s += '</div>';
    s += '<br><br>';

    document.getElementById('c_side').innerHTML = s;

    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}


function bytUser(){

    document.getElementById('div_result').innerHTML = '';

    // Domare
    curr_JerseyNo = $("#cbUser").val();
    if (curr_JerseyNo == -1) return;



    var instring   = '{"JerseyNo": ' + curr_JerseyNo + '}';

    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/get_inlogningar.php", js_objekt)
        .done(function(data) {
	          bytUser_success(data);
	})
        .fail(function() {
	          bytUser_fail();
	})
        .always(function() {

	});

}

function bytUser_success(response){

    Inlogningar = response;


    if (Inlogningar.status == 'Error'){
	      alert('Uppgifter om inloggningar har INTE kunnat hämtas pga ett fel. ');
    } else if (Inlogningar.status == 'OK'){
	      visaInlogningar();
    } else {
	      alert("Ett fel har inträffat. Uppgifter har INTE kunnat hämtas.");
    }

}

function bytUser_fail(){
    alert('Det gick inte att utföra operationen på grund av ett oförutsägbart fel!');
}

function visaInlogningar(){
    var s = '<table class="table">';
    s += '<caption>Totalt ' + Inlogningar.Inlogningar.length + ' inloggningar funna</caption>' ;
    s += '<thead>';
    s += '  <tr>';
    s += '  <th>ID</th>';
    if (curr_JerseyNo == 0){
	      s += '    <th>Namn</th>';
    }
    s += '    <th>Inloggning</th>';
    s += '    <th>Utloggning</th>';
    s += '  </tr>';
    s += '</thead>';

    s += '<tbody>';
    for (var i = 0; i < Inlogningar.Inlogningar.length; ++i){
	      s += '<tr>';
	      s += '<td>' + Inlogningar.Inlogningar[i].TrafficID      + '</td>';
	      if (curr_JerseyNo == 0){

	          s += '<td>' + getDomare(Inlogningar.Inlogningar[i].JerseyNo)      + '</td>';
	      }
	      s += '<td>' + Inlogningar.Inlogningar[i].Login      + '</td>';
	      s += '<td>';
	      if (Inlogningar.Inlogningar[i].Logout){
	          s += Inlogningar.Inlogningar[i].Logout;
	      }
	      s += '</td>';
	      s += '</tr>';
    }
    s += '</tbody></table>';

    s += '<br>';
    s += '<div class="text-center"><button type="button" class="btn btn-info" onclick="tillbaka()">Till mitt konto</button></div>';

    document.getElementById('div_result').innerHTML = s;

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
