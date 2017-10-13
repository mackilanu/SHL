
function krysslista(){

    //window.open();
    // When the user clicks the button, open the modal
    // Get the modal

    var instring ='{"action": "krysslista"}';

    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/krysslista.php", js_objekt)
        .done(function(data) {
              krysslista_success(data);
          })
        .fail(function() {
              krysslista_fail();
          })
        .always(function() {

          });
}

function getKrysslista(){
    var MM = document.getElementById('cbManad').value;
    if (MM == -1){
        alert("Du måste välja månad");
        return;
    }
    var domartyp = document.getElementById('cbDomare2').value;
    if (domartyp == -1){
        alert("Du måste välja domartyp.");
        return;
    }

    var instring ='{"manad": "' + MM + '", ';
    instring += '"domartyp": "' + domartyp + '"}';

    var js_objekt = JSON.parse(instring);
    console.log("instring="+instring);

    $.getJSON("ajax/krysslista2.php", js_objekt)
        .done(function(data) {
              getKrysslista_success(data,MM,domartyp);
          })
        .fail(function() {
              getKrysslista_fail();
          })
        .always(function() {

          });
}

function krysslista_success(response){

    if (response.status == 'Fel indata'){
        alert("Felaktiga indata.");
        return;
    }

    if (response.status == 'Error'){
        alert("Krysslistan kunde inte framställas på grund av ett oförusett fel. Vid upprepade fel kontakta webbadministratören.");
        return;
    }


    AllaDomare     = response.Domare;

    var MaxDate = response.MaxDate;
    var YYYY    = MaxDate.substr(0,4);
    if (leapYear(YYYY)) dagar[2] = 29;

    var MM      = Number(MaxDate.substr(5,2));
    var manad   = MaxDate.substr(5,2);

    var s = '<br>Krysslista för säsongen <b>' + Season + '</b>';
    s += ", månad&nbsp;&nbsp;&nbsp;&nbsp;<select id='cbManad' onchange='getKrysslista()'  class=''>";
    s += "<option value='-1'>Välj månad </option>";

    MinYear  = Number(MinDatum.substring(0,4));
    MaxYear  = Number(MaxDatum.substring(0,4));

    MinMonth = Number(MinDatum.substring(5,7));
    MaxMonth = Number(MaxDatum.substring(5,7));

    if (MinYear == MaxYear){
        for (var i = MinMonth; i <= MaxMonth; ++i){
            s += "<option";
            if (i == MM){
                s += ' selected';
            }
            s += ' value=' + String(i) + '>' + manader[i] + '</option>';
        }
    } else {
        for (i = MinMonth; i <= 12; ++i){
            s += "<option";
            if (i == MM){
                s += 'selected';
            }
            s += ' value=' + String(i) + '>' + manader[i] + '</option>';
        }
        for (i = 1; i <= MaxMonth; ++i){
            s += "<option";
            if (i == MM){
                s += ' selected';
            }
            s += ' value=' + String(i) + '>' + manader[i] + '</option>';
        }
    }

    s += "</select>";

    s += " och domartypen&nbsp;&nbsp;&nbsp;&nbsp;<select id='cbDomare2' onchange='getKrysslista()'  class=''>";
    s += "<option value='-1'>Välj domare </option>";
    s += "<option selected value='1'>" + Domartyper[1] + "</option>";
    s += "<option value='2'>" + Domartyper[2] + "</option>";
    s += "<option value='3'>" + Domartyper[3] + "</option>";

    s += "</select>";
    s += '&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-primary" onclick="doljKrysslista()">Dölj krysslista</button>';

    s += '<div id="div_table">';
    s += '<br>';
    s += '<table class="table">';
    s += '<thead>';
    s += '<tr>';
    s += '<th>Domare</th>';
    s += '<th>Totalt</th>';
    for (i = 1; i < dagar[MM] + 1; i++){
        var datum = YYYY + '-' + manad + '-';
        if (i < 10) datum += '0';
        datum += i;

        var Veckodag = getVeckodag(datum).substr(0,1);
        if (Veckodag != 'S'){
            s += '<th>';
        } else {
            s += '<th style="color: red">';
        }
        s += String(i) + '<br>' + Veckodag + '</th>';
    }
    s += '</tr>';
    s += '</thead>';

    s += '<tbody>';
    //    for (i = 0; i < response.Domare.length; i++){
    for (i = 0; i < AllaDomare.length; i++){
        var TotalMatcher = 0;
        if (AllaDomare[i].Domartyp == 1){
            s += '<tr>';
            s += '<td>' + AllaDomare[i].JerseyNo + '-' + AllaDomare[i].LastName + ', ' + AllaDomare[i].FirstName + '</td>';

            // Sumerar antal matcher
            for (k = 0; k < response.Matcher.length; k++){
                if (response.Matcher[k].domare1 == AllaDomare[i].JerseyNo || response.Matcher[k].domare2 == AllaDomare[i].JerseyNo){
                        TotalMatcher += 1;
                }
            }
            s += '<td>';
            if (TotalMatcher > 0) s += String(TotalMatcher);
            s += '</td>';

            for (var j = 1; j < dagar[MM] + 1; j++){
                datum = YYYY + '-' + manad + '-';
                if (j < 10) datum += '0';
                datum += j;
                Veckodag = getVeckodag(datum).substr(0,1);
                s += '<td title="' + String(j) + '-' + Veckodag + '"';
                if (Veckodag == 'S'){
                    s += ' style="color: red"';
                }
                s += '>';
                for (var k = 0; k < response.Ledigheter.length; k++){
                    if (response.Ledigheter[k].JerseyNo == AllaDomare[i].JerseyNo){
                        if (String(response.Ledigheter[k].Datum) == String(datum)){
                            s += 'X';
                            break;
                        }
                    }
                }

                for (k = 0; k < response.Matcher.length; k++){
                    if (response.Matcher[k].domare1 == AllaDomare[i].JerseyNo || response.Matcher[k].domare2 == AllaDomare[i].JerseyNo){
                        if (String(response.Matcher[k].Date).substr(0,10) == String(datum)){
                            s += 'M';
                            TotalMatcher += 1;
                            break;
                        }
                    }
                }

                s += '</td>';
            }
            s += '</tr>';
        }
    }


    s += '</tbody>';

    s += '</table>';
    s += '</div>';
    s += '<button type="button" class="btn btn-primary" onclick="doljKrysslista()">Dölj krysslista</button>';


    document.getElementById('div_kryss_body').innerHTML = s;

    modal = document.getElementById('myKryss');

/*
    // Get the button that opens the modal
    var tmp = 'knapp' + Rad;
    btn = document.getElementById(tmp);
*/
    modal.style.display = "block";

}

function krysslista_fail(){
    alert("Listan kunde inte framställas på grund av ett oförusett fel. Vid upprepade fel kontakta webbadministratören.");
}

function doljKrysslista() {
    modal.style.display = "none";
    //document.getElementById('div_kommentar').innerHTML = '';
}


function getKrysslista_success(response,MM,domartyp){

    document.getElementById("div_table").innerHTML = '';

    if (response.status == 'Error'){
        alert("Krysslistan kunde inte framställas på grund av ett oförusett fel. Vid upprepade fel kontakta webbadministratören.");
        return;
    }


    var s = '<br>';
    s += '<table class="table">';
    s += '<thead>';
    s += '<tr>';
    s += '<th>Domare</th>';
    s += '<th>Totalt</th>';
    var YYYY = Season;
    if (MM < 8) YYYY += 1;
    if (leapYear(YYYY)) dagar[2] = 29;

    var manad   = MM;
    if (MM < 10) manad = '0' + manad;

    for (var i = 1; i < dagar[MM] + 1; i++){
        var datum = YYYY + '-' + manad + '-';
        if (i < 10) datum += '0';
        datum += i;

        var Veckodag = getVeckodag(datum).substr(0,1);
        if (Veckodag != 'S'){
            s += '<th>';
        } else {
            s += '<th style="color: red">';
        }
        s += String(i) + '<br>' + Veckodag + '</th>';
    }
    s += '</tr>';
    s += '</thead>';

    s += '<tbody>';
    for (i = 0; i < AllaDomare.length; i++){
        var TotalMatcher = 0;
        if (AllaDomare[i].Domartyp == domartyp){
            s += '<tr>';
            s += '<td>' + AllaDomare[i].JerseyNo + '-' + AllaDomare[i].LastName + ', ' + AllaDomare[i].FirstName + '</td>';

            // Sumerar antal matcher
            for (k = 0; k < response.Matcher.length; k++){
                if (response.Matcher[k].domare1 == AllaDomare[i].JerseyNo || response.Matcher[k].domare2 == AllaDomare[i].JerseyNo){
                    TotalMatcher += 1;
                }
            }
            s += '<td>';
            if (TotalMatcher > 0) s += String(TotalMatcher);
            s += '</td>';

            for (var j = 1; j < dagar[MM] + 1; j++){
                datum = YYYY + '-' + manad + '-';
                if (j < 10) datum += '0';
                datum += j;
                Veckodag = getVeckodag(datum).substr(0,1);
                s += '<td title="' + String(j) + '-' + Veckodag + '"';
                if (Veckodag == 'S'){
                    s += ' style="color: red"';
                }
                s += '>';
                for (var k = 0; k < response.Ledigheter.length; k++){
                    if (response.Ledigheter[k].JerseyNo == AllaDomare[i].JerseyNo){
                        //console.log("String(response.Ledigheter[k].Datum)="+String(response.Ledigheter[k].Datum));
                        //console.log("String(datum)="+String(datum));
                        if (String(response.Ledigheter[k].Datum) == String(datum)){
                            s += 'X';
                            break;
                        }
                    }
                }

                for (k = 0; k < response.Matcher.length; k++){
                    if (response.Matcher[k].domare1 == AllaDomare[i].JerseyNo || response.Matcher[k].domare2 == AllaDomare[i].JerseyNo){
                        if (String(response.Matcher[k].Date).substr(0,10) == String(datum)){
                            s += 'M';
                            break;
                        }
                    }
                }

                s += '</td>';
            }
            s += '</tr>';
        }
    }


    s += '</tbody>';

    s += '</table>';

    //s += '<button type="button" class="btn btn-primary" onclick="doljKrysslista()">Dölj krysslista</button>';


    document.getElementById('div_table').innerHTML = s;

}

function getKrysslista_fail(){
    alert("Listan kunde inte framställas på grund av ett oförusett fel. Vid upprepade fel kontakta webbadministratören.");
}

function visa_sidan() {

   var s = '<div class="col-md-6 col-xs-6 right-header">';
   s += '<a href="mittkonto.php"><img src="Images/SHL-logo.jpg" alt="SHL" class="logo" style="width:80%;"></a></div>';
   s += '<a href="/files/lista.txt" download id="download" hidden></a>';
   s += '<div class="col-md-6 col-xs-6 left-header">';
   logInfo = JSON.parse(logInfo);
   s += '<p id="inloggadsom" class="text-right">';
   s += logInfo.JerseyNo + '-' + logInfo.FirstName + ', ' + logInfo.LastName;
   s += '<br>' + Domartyper[logInfo.Domartyp] + '</p>';
   s += '<p id="knapp" class="text-right"></p>';
   s += '</div>';


   s += '<h1 class="center-text">Domartillsättning</h1>';
   s += '<br>';

   s += '<div class="class="main-content" style="margin: auto 0%;">';


   if (Domarlista.status == 'Error'){
      s += '<br>';
      s += 'Ett fel har förhindrat sidans normala uppbyggnad. Vid upprepade fel kontakta webbadministratören.';

   } else {

      // Fr.o.m. datum
      s += '<label>From:</label>';
      s +='<input type="text" onchange="CheckDate()" id="txtFromDate" value="">';

      // T.o.m. datum
      s += '&nbsp;<label>Tom:</label>';
      s +='<input type="text" onchange="CheckDate()" id="txtToDate" value="">';

      // Urval
      s += '&nbsp;<label>Matchurval:</label>';
      s += '<select id="cbUrval" onchange="hamta_matcher()">';
      s += '<option>Välj matcher</option>';
      s += '<option>Alla matcher i datumintervallet</option>';
      s += '<option>Ej tillsatta matcher</option>';
      s += '<option>Ej eller delvis tillsatta matcher</option>';
      s += '<option>Matcher med tillsättningskommentar</option>';
      s += '<option>Hämta tillsättningslista</option>';
      s += '</select>';
      s += '&nbsp;&nbsp;<button type="button" class="btn btn-primary" onclick="krysslista()">Krysslista</button>';
      s += '&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button>';

       // Modalform för Krysslista
       s += '<div id="myKryss" class="modal">';
       // Modal content
       s += '<div class="modal-content">';

       s += '<div class="modal-header">';
       //s += '<span class="close">&times;</span>';
       s += '<h4>refmanagment</h4>';
       s += '<h5>T. Pavlidis - NitsaSoft in Sweden AB</h5>';
       s += '</div>';

       s += '<div id="div_kryss_body" class="modal-body">';
       s += '</div>';

       s += '<div class="modal-footer">';
       s += '<h5>Marcus Andresson - IT gymnasiet i Karlstad</h5>';
       s += '</div>';

       s += '</div>';
       s += '</div>';


      // Tom div
      s += '<div id="div_result"></div>';
   }


    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('c_side').innerHTML = s;
    document.getElementById("txtFromDate").value = Dagens;

    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;
}



function initiera() {

    Dagens = getDagens();



    var s = '<div class="col-md-0 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-12 col-xs-12"></div>';
    s += '<div class="col-md-0 col-xs-0"></div>';

    document.getElementById('div_container').innerHTML = s;

    visa_sidan();
    visa_foten();
}


function tillbaka() {
    window.open('mittkonto.php', '_self');
}

function CheckDate() {
    document.getElementById('div_result').innerHTML = '';
    document.getElementById('cbUrval').selectedIndex = 0;

     var from = document.getElementById("txtFromDate").value;
     var tom  = document.getElementById("txtToDate").value;

     if(tom == "") return;

    if(tom < from){
         alert("From kan inte vara större än Tom ");
    }
}

function hamta_matcher() {
    document.getElementById('div_result').innerHTML = '';

    var UrvalIndex = document.getElementById('cbUrval').selectedIndex;
    if (UrvalIndex == 0){
          document.getElementById('div_result').innerHTML = '';
          return;
    }



    var FromDate = rensatoDB(document.getElementById('txtFromDate').value.trim());
    document.getElementById('txtFromDate').value = FromDate;
    if (!FromDate){
          alert("Från och med datum saknas.");
          document.getElementById('cbUrval').selectedIndex = 0;
          document.getElementById('txtFromDate').focus();
          return;
    }
    FromDate = FromDate + ' 00:00:00';


    var ToDate = rensatoDB(document.getElementById('txtToDate').value.trim());
    document.getElementById('txtToDate').value = ToDate;
    if (!ToDate){
          alert("Till och med datum saknas.");
          document.getElementById('cbUrval').selectedIndex = 0;
          document.getElementById('txtToDate').focus();
          return;
    }
    ToDate = ToDate + ' 23:59:59';

    // Här måste det kontrolleras att det finns riktiga datum för säsongen
    // som sträcker sig från och med Season-08-01 till och med (Season+1)-07-31
    // samt att ToDate >= FromDate

    if(UrvalIndex == 5){
        var instring  = '{"FromDate": "'+ FromDate +'", "ToDate": "'+ ToDate +'"}';
        var js_objekt = JSON.parse(instring);

        $.getJSON("ajax/SkapaMatchFil.php", js_objekt)
        .done(function(data) {
        SkapaMatchFil_success(data);
    })
        .fail(function() {
        SkapaMatchFil_fail();
    })
        .always(function() {
       
    });
       
        return;
    }


    var instring ='{"UrvalIndex": ' + String(UrvalIndex) + ', ';
    instring += '"FromDate": "' + FromDate + '", ';
    instring += '"ToDate": "' + ToDate + '"}';


    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/hamta_matcher.php", js_objekt)
        .done(function(data) {
        hamta_matcher_success(data);
    })
        .fail(function() {
        hamta_matcher_fail();
    })
        .always(function() {

    });

}

function SkapaMatchFil_success(response){

    if(response.status == "OK"){
        document.getElementById('download').click();
    }

    if(response.status == "Error"){
        alert("Det gick inte att skapa filen. Om problemet kvarstår vänligen kontakta administratör.");
    }

    if(response.status == "NoGames"){
        alert("Det finns inga matcher i det valda datumintervallet.");
    }
}

function SkapaMatchFil_fail(){
    alert("Ett oförutsett fel har inträffat när filen skulle skapas. Om problemet kvarstår vänligen kontakta administratör.");
}

function hamta_matcher_success(response) {

    Matchlista      = response;
    
    if (Matchlista.status == 'Error'){
          alert("Hämtning av matcher har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (Matchlista.status == 'Inga matcher'){
          alert("Det finns inga matcher inom denna tidsperiod.");
          document.getElementById('cbUrval').selectedIndex = 0;
    } else if (Matchlista.status == 'OK'){
          visa_matcher();

    } else {
          alert("Oförutsett fel har inträffat!");
    }
}

function hamta_matcher_fail() {

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
    document.getElementById('div_result').innerHTML = '';

}

$( function() {
    $( "#txtFromDate" ).datepicker( {dateFormat: 'yy-mm-dd' });
} );


$( function() {
    $( "#txtToDate" ).datepicker( {dateFormat: 'yy-mm-dd' });
} );

function visa_matcher() {
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
    s += '<caption>Totalt ' + Matchlista.Match.length + ' matcher funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Match</th>';
    s += '<th>HD1</th>';
    s += '<th>HD2</th>';
    s += '<th>LD1</th>';
    s += '<th>LD2</th>';
    s += '<th>Coach</th>';
    s += '<th>Spara</th>';
    s += '<th>Publicera</th>';
    s += '<th>Kommentar</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';



    for (var i = 0; i < Matchlista.Match.length; i++){
          Inaktiv = false;
          if (Matchlista.Match[i].Date < Dagens) Inaktiv = true;

          var tmp0 = getVeckodag(Matchlista.Match[i].Date);
          s += '<tr style="background:white" cursor:default>';

          // Datum
          var tmp = Matchlista.Match[i].Arena + '-' + Matchlista.Match[i].GameType;
          s += '<td title="' + tmp + '"><b>' + tmp0 + '</b> ' + Matchlista.Match[i].Date + '</td>';

          // Match
          var tmp1 = Matchlista.Match[i].HomeCode + '-' + Matchlista.Match[i].AwayCode;
          var tmp2 = Matchlista.Match[i].HomeName + '-' + Matchlista.Match[i].AwayName;
          s += '<td title="' + tmp2 + '">' + tmp1 + '</td>';

          // HD1
          var Rad    = i;
          var Domartyp = 1;
          var Kolumn   = 1;
        s += visaKnapp(Rad,Kolumn,Domartyp);

          // HD2
          Domartyp = 1;
          Kolumn   = 2;
        s += visaKnapp(Rad,Kolumn,Domartyp);

          // LD1
          Domartyp = 2;
          Kolumn   = 3;
        s += visaKnapp(Rad,Kolumn,Domartyp);

          // LD2
          Domartyp = 2;
          Kolumn   = 4;
        s += visaKnapp(Rad,Kolumn,Domartyp);

          // Dcoach
          Domartyp = 3;
          Kolumn   = 5;
        s += visaKnapp(Rad,Kolumn,Domartyp);

          // Spara
        s += '<td id="savecell' + String(Rad) + '"></td>';

          // PubliceraMatch
          s += '<td><input type="checkbox" id="chPubl' + String(i) + '"';
          if (Matchlista.Match[i].PubliceraMatch){
              s += ' checked';
          }
          if (Inaktiv || (!Matchlista.Match[i].HD1 || !Matchlista.Match[i].HD2 || !Matchlista.Match[i].LD1 || !Matchlista.Match[i].LD2)){
              s += ' disabled';
          }
          s += ' onclick="publicera(' + String(i) + ')"></td>';

          // Kommentar
          Kolumn   = 6;
          s += '<td id="cell' + String(Rad) + '_' + Kolumn + '"><button type="button" id="knapp' + String(Rad) + '" class="';
          if (Matchlista.Match[Rad].Kommentar){
              s += 'btn btn-primary';
          } else {
              s += 'btn btn-warning';
          }
          s += '" onclick="visa_kommentar(' + String(Rad) + ')"';
          if (Matchlista.Match[i].Kommentar){
              s += ' title="' + Matchlista.Match[Rad].Kommentar + '">';
          } else {
              s += '>';
          }
          s += 'Kommentar</button></td>';

          s += '</tr>';
    }
    s += '</tbody>';
    s += '</table>';

    s += '<br>';
    s += '<br>';

    s += '<div id="div_buttons" class="text-center"><button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button></div>';

    document.getElementById('div_result').innerHTML = s;

}

function publicera(i) {

    var tmp = 'chPubl' + i;
    var Publish = '';
    if (document.getElementById(tmp).checked == true) Publish = 'J';

    var instring = '{"GameId": '    + Matchlista.Match[i].GameId   + ', ';
    instring += '"Publicera":"' + Publish + '"}';

    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/set_publicera.php", js_objekt)
        .done(function(data) {
        publicera_success(data, tmp);
    })
        .fail(function() {
        publicera_fail();
    })
        .always(function() {

    });

}


function publicera_success(response, tmp) {

    if (response.status == 'Error'){
          alert();ert("Publiceringen har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");

          if (document.getElementById(tmp).checked == true){
              document.getElementById(tmp).checked = false;
          } else {
              document.getElementById(tmp).checked = true;
          }

    } else if (response.status == 'OK'){
          //alert("Publiceringen har nu noterats");

    } else {
          alert("Oförutsett fel har inträffat!");
    }
}


function publicera_fail() {

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function getDomare(domarID) {
    var svar = '';
    for (var i = 0; i < Domarlista.Domare.length; ++i){
          if (Domarlista.Domare[i].JerseyNo == Math.abs(domarID)){
              svar = Domarlista.Domare[i].LastName + ', ' + Domarlista.Domare[i].FirstName;
              return svar;
          }
    }
    return svar;
}


function hamta_domare(Rad, Kolumn, Domartyp) {

    var tmp = '';
    if (matchEditeras(Rad)){
        tmp = 'Tillsättning av matchen ' + Matchlista.Match[EditDomare[0]].HomeCode + ' - ' + Matchlista.Match[EditDomare[0]].AwayCode + ' pågår. Du måste avsluta denna matchtillsättning först innan du kan gå vidare med annan match.';
        alert(tmp);
        return;
    }


    var Datum    = Matchlista.Match[Rad].Date;
    Datum = Datum.slice(0,10);

    var HomeCode = Matchlista.Match[Rad].HomeCode;
    var AwayCode = Matchlista.Match[Rad].AwayCode;

    var instring = '{"GameId": '    + Matchlista.Match[Rad].GameId   + ', ';
    instring    += '"Datum": "'     + Datum                            + '", ';
    instring    += '"HomeCode": "'  + HomeCode                         + '", ';
    instring    += '"AwayCode": "'  + AwayCode                         + '", ';
    instring    += '"domartyp": '   + Domartyp                         + '}';


    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/hamta_domare.php", js_objekt)
        .done(function(data) {
              hamta_domare_success(data, Rad, Kolumn, Domartyp);
    })
        .fail(function() {
              hamta_domare_fail();
    })
        .always(function() {

    });

}

function hamta_domare_success(response, Rad, Kolumn, Domartyp) {

    LedigaDomare = response;

    if (LedigaDomare.status == 'Error'){
          alert("Hämtning av domare har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (LedigaDomare.status == 'OK'){
          visa_domare(Rad, Kolumn, Domartyp);

    } else {
          alert("Oförutsett fel har inträffat!");
    }
}

function hamta_domare_fail() {

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomförassssssssss");
}

function visa_domare(Rad, Kolumn, Domartyp) {

    EditDomare[0]      = Rad;
    EditDomare[Kolumn] = 1;


    var s = '<select id="cbDomare" onchange="visa_vald_domare(' + Rad + ',' + Kolumn + ',' + Domartyp + ')">';

    s += '<option value="">Välj ';
    if (Domartyp == 1){
          s += 'domare';
    } else if (Domartyp == 2){
          s += 'linjedomare';
    } else if (Domartyp == 3){
          s += 'domarcoach';
    }
    s += '</option>';

    // Ångra åtgärd
    s += '<option value="cancel">Ångra </option>';

    // Borttagning av domare
      s += '<option value="radera">Ingen ';
      if (Domartyp == 1){
          s += 'domare';
      } else if (Domartyp == 2){
          s += 'linjedomare';
      } else if (Domartyp == 3){
          s += 'domarcoach';
      }
      s += '</option>';



    for (var i = 0; i < LedigaDomare.Domare.length; i++){

          var JerseyNo = LedigaDomare.Domare[i].JerseyNo;

          s += '<option value="';
        s += String(JerseyNo) + '"';
          if (Kolumn == 1){
              if (JerseyNo == Matchlista.Match[Rad].HD1){
                    s += ' selected';
              }
          } else if (Kolumn == 2){
              if (JerseyNo == Matchlista.Match[Rad].HD2){
                    s += ' selected';
              }
          } else if (Kolumn == 3){
              if (JerseyNo == Matchlista.Match[Rad].LD1){
                    s += ' selected';
              }
          } else if (Kolumn == 4){
              if (JerseyNo == Matchlista.Match[Rad].LD2){
                    s += ' selected';
              }
          }

          tmp = getDomare(JerseyNo);
        if (Kolumn != 5){
              tmp = LedigaDomare.Domare[i].hemma_hemma + '-' + LedigaDomare.Domare[i].borta_borta + '-' + LedigaDomare.Domare[i].veckomatcher + '-' + tmp;
          }

          s += '>' + tmp + '</option>';

    }
    s += '</select>';

    tmp = 'cell' + Rad + '_' + Kolumn;
    document.getElementById(tmp).innerHTML = s;

}

function visa_kommentar(Rad) {
    // When the user clicks the button, open the modal
    // Get the modal

    var s = '<br>Kommentar för matchen <b>' + Matchlista.Match[Rad].HomeName + ' - ' + Matchlista.Match[Rad].AwayName + '</b>';
    s += '<br><textarea id="txtKommentar" rows="8" cols="60" style="background-color: Silver">';
    if (Matchlista.Match[Rad].Kommentar){
          s += Matchlista.Match[Rad].Kommentar;
    }
    s += '</textarea>';
    s += '<br>';

    Inaktiv = false;
    if (Matchlista.Match[Rad].Date < Dagens) Inaktiv = true;
    if (Inaktiv == false){
          s += '<button type="button" class="btn btn-primary" onclick="sparaKommentar(' + Rad + ')">Spara kommentar</button>&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    s += '<button type="button" class="btn btn-primary" onclick="doljKommentar()">Dölj kommentar</button>';


    document.getElementById('div_modal_body').innerHTML = s;
    document.getElementById('txtKommentar').focus();


    modal = document.getElementById('myModal');


    // Get the button that opens the modal
    var tmp = 'knapp' + Rad;
    btn = document.getElementById(tmp);

    modal.style.display = "block";

}

function doljKommentar() {
    modal.style.display = "none";
    //document.getElementById('div_kommentar').innerHTML = '';
}

function sparaKommentar(Rad) {

    var Kommentar = rensatoDB(document.getElementById('txtKommentar').value.trim());

    var instring ='{"GameId": ' + String(Matchlista.Match[Rad].GameId) + ', ';
    instring += '"Kommentar": "' + Kommentar + '"}';


    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/update_kommentar.php", js_objekt)
        .done(function(data) {
              sparaKommentar_success(data,Rad);
    })
        .fail(function() {
              sparaKommentar_fail();
    })
        .always(function() {

    });

}

function sparaKommentar_success(response,Rad) {

    if (response.status == 'Error'){
          alert("Uppdatering av kommentar har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (response.status == 'OK'){
          aterstall_kommentar(Rad);

    } else {
          alert("Oförutsett fel har inträffat!");
    }
}

function sparaKommentar_fail() {

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function aterstall_kommentar(Rad) {

    Inaktiv = false;
    if (Matchlista.Match[Rad].Date < Dagens) Inaktiv = true;

    var Kommentar = document.getElementById('txtKommentar').value;
    Matchlista.Match[Rad].Kommentar = Kommentar;

    // Button Kommentar
    Kolumn   = 6;
    var id='cell' + String(Rad) + '_' + Kolumn;
    var s = '<button type="button" class="';
    if (Matchlista.Match[Rad].Kommentar){
          s += 'btn btn-primary';
    } else {
          s += 'btn btn-warning';
    }
    s += '" onclick="visa_kommentar(' + String(Rad) + ')"';
    if (Inaktiv) s += ' disabled';
    if (Matchlista.Match[Rad].Kommentar){
          s += ' title="' + Matchlista.Match[Rad].Kommentar + '">';
    } else {
          s += '>';
    }
    s += 'Kommentar</button></td>';

    document.getElementById(id).innerHTML = s;

    doljKommentar();
}

function spara(Rad) {

    var id='knapp' + String(Rad) + '_1';
    var HD1 = document.getElementById(id).value;
    if (HD1 == 'radera') HD1 = null;

    id='knapp' + String(Rad) + '_2';
    var HD2 = document.getElementById(id).value;
    if (HD2 == 'radera') HD2 = null;

    id='knapp' + String(Rad) + '_3';
    var LD1 = document.getElementById(id).value;
    if (LD1 == 'radera') LD1 = null;

    id='knapp' + String(Rad) + '_4';
    var LD2 = document.getElementById(id).value;
    if (LD2 == 'radera') LD2 = null;

    id='knapp' + String(Rad) + '_5';
    var Dcoach = document.getElementById(id).value;
    if (Dcoach == 'radera') Dcoach = null;



    if (HD1 && HD1 == HD2){
        alert("Åtgärden makuleras. Du har samma huvuddomare i matchen. Rätta till detta.");
        return;
    }


    if (LD1 && LD1 == LD2){
        alert("Åtgärden makuleras. Du har samma linjedomare i matchen. Rätta till detta.");
        return;
    }


    var instring ='{"GameId": ' + String(Matchlista.Match[Rad].GameId) + ', ';
    instring += '"HD1": "'    + HD1    + '", ';
    instring += '"HD2": "'    + HD2    + '", ';
    instring += '"LD1": "'    + LD1    + '", ';
    instring += '"LD2": "'    + LD2    + '", ';
    instring += '"Dcoach": "' + Dcoach + '"}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/update_domartillsattning.php", js_objekt)
        .done(function(data) {
              spara_success(data,Rad,HD1,HD2,LD1,LD2,Dcoach);
    })
        .fail(function() {
              spara_fail(Rad);
    })
        .always(function() {

    });

}

function spara_success(response,Rad,HD1,HD2,LD1,LD2,Dcoach) {


    if (response.status == 'Error'){
          alert("Domartillstättningen har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören. Originalvärden läggs tillbaka!");

        var id='cell' + String(Rad) + '_1';
        document.getElementById(id).innerHTML = visaKnapp(Rad,1,1);;
        id='cell' + String(Rad) + '_2';
        document.getElementById(id).innerHTML = visaKnapp(Rad,2,1);;
        id='cell' + String(Rad) + '_3';
        document.getElementById(id).innerHTML = visaKnapp(Rad,3,2);;
        id='cell' + String(Rad) + '_4';
        document.getElementById(id).innerHTML = visaKnapp(Rad,4,2);;
        id='cell' + String(Rad) + '_5';
        document.getElementById(id).innerHTML = visaKnapp(Rad,5,3);;
        angraEditering(Rad,1);
        angraEditering(Rad,2);
        angraEditering(Rad,3);
        angraEditering(Rad,4);
        angraEditering(Rad,5);

    } else if (response.status == 'OK'){

        // Sätt de nya värdena
        Matchlista.Match[Rad].HD1 = HD1;
        Matchlista.Match[Rad].HD2 = HD2;
        Matchlista.Match[Rad].LD1 = LD1;
        Matchlista.Match[Rad].LD2 = LD2;
        Matchlista.Match[Rad].Dcoach = Dcoach;

        // Makulera editeringsstatus
        angraEditering(Rad,1);
        angraEditering(Rad,2);
        angraEditering(Rad,3);
        angraEditering(Rad,4);
        angraEditering(Rad,5);

        // Visa knapparna med originalfärger
        var id='cell' + String(Rad) + '_1';
        document.getElementById(id).innerHTML = visa_OrigKnapp(Rad,1,1);;
        id='cell' + String(Rad) + '_2';
        document.getElementById(id).innerHTML = visa_OrigKnapp(Rad,2,1);;
        id='cell' + String(Rad) + '_3';
        document.getElementById(id).innerHTML = visa_OrigKnapp(Rad,3,2);;
        id='cell' + String(Rad) + '_4';
        document.getElementById(id).innerHTML = visa_OrigKnapp(Rad,4,2);;
        id='cell' + String(Rad) + '_5';
        document.getElementById(id).innerHTML = visa_OrigKnapp(Rad,5,3);;


        //hamta_matcher();


        // Aktivera Publicera-checkboxen om det behövs.
        if (HD1 > 0 && HD2 > 0 && LD1 > 0 && LD2 > 0){
            var tmp = 'chPubl' + Rad;
            document.getElementById(tmp).disabled = false;
        }


        // Ta bort Spara-knappen
        id = 'savecell' + String(Rad) ;
        document.getElementById(id).innerHTML = '';

    } else {
          alert("Oförutsett fel har inträffat. Originalvärden läggs tillbaka!");
        id='cell' + String(Rad) + '_1';
        document.getElementById(id).innerHTML = visaKnapp(Rad,1,1);;
        id='cell' + String(Rad) + '_2';
        document.getElementById(id).innerHTML = visaKnapp(Rad,2,1);;
        id='cell' + String(Rad) + '_3';
        document.getElementById(id).innerHTML = visaKnapp(Rad,3,2);;
        id='cell' + String(Rad) + '_4';
        document.getElementById(id).innerHTML = visaKnapp(Rad,4,2);;
        id='cell' + String(Rad) + '_5';
        document.getElementById(id).innerHTML = visaKnapp(Rad,5,3);;
        angraEditering(Rad,1);
        angraEditering(Rad,2);
        angraEditering(Rad,3);
        angraEditering(Rad,4);
        angraEditering(Rad,5);

    }
}

function spara_fail(Rad) {

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras. Originalvärden läggs tillbaka!");

    // Ställ tillbaka originalvärdena
    var id='cell' + String(Rad) + '_1';
    document.getElementById(id).innerHTML = visaKnapp(Rad,1,1);;
    id='cell' + String(Rad) + '_2';
    document.getElementById(id).innerHTML = visaKnapp(Rad,2,1);;
    id='cell' + String(Rad) + '_3';
    document.getElementById(id).innerHTML = visaKnapp(Rad,3,2);;
    id='cell' + String(Rad) + '_4';
    document.getElementById(id).innerHTML = visaKnapp(Rad,4,2);;
    id='cell' + String(Rad) + '_5';
    document.getElementById(id).innerHTML = visaKnapp(Rad,5,3);;
    angraEditering(Rad,1);
    angraEditering(Rad,2);
    angraEditering(Rad,3);
    angraEditering(Rad,4);
    angraEditering(Rad,5);
}

function visa_vald_domare(Rad,Kolumn,Domartyp) {

    curr_JerseyNo = $("#cbDomare").val();
    console.log("curr_JerseyNo="+curr_JerseyNo);
    if (curr_JerseyNo == "") return;



    if (curr_JerseyNo == 'cancel'){

        // Ångrar
        var s = visaKnapp(Rad,Kolumn,Domartyp);
        var id='cell' + String(Rad) + '_' + Kolumn;
        document.getElementById(id).innerHTML = s;
        angraEditering(Rad,Kolumn);
    } else {
        if (curr_JerseyNo == 'radera'){
            // Ingen domare
            visa_NyKnapp(Rad,Kolumn,Domartyp,curr_JerseyNo);
            visa_sparaKnapp(Rad);

        } else {
            // Domare finns
            visa_NyKnapp(Rad,Kolumn,Domartyp,curr_JerseyNo);
            visa_sparaKnapp(Rad);
        }
    }
}

function visa_sparaKnapp(Rad) {

    // Aktivera Spara-knappen.
    var s = '<td><button  id="save' + String(Rad) + '" type="button" class="';
      s += 'btn btn-success';
      s += '" onclick="spara(' + String(Rad) + ')">Spara</button></td>';

    tmp = 'savecell' + String(Rad);
    document.getElementById(tmp).innerHTML = s;

}

function visa_NyKnapp(Rad,Kolumn,Domartyp,curr_JerseyNo) {
    console.log("visa_NyKnapp-curr_JerseyNo="+curr_JerseyNo);
    if (curr_JerseyNo != 'radera'){
        curr_JerseyNo = Number(curr_JerseyNo);
    }


      var s = '<button type="button" id="knapp' + String(Rad) + '_' + Kolumn + '" class="';

        s += 'btn btn-default';
      s += '" onclick="hamta_domare(' + String(Rad) + ', ' + Kolumn + ',' + Domartyp + ')"';
    if (curr_JerseyNo != 'radera'){
          s += ' title="' + getDomare(curr_JerseyNo) + '"';
    } else {
          s += ' title="radera"';
    }
    s += ' value="';
    if (curr_JerseyNo != 'radera'){
        s += Math.abs(curr_JerseyNo);
    } else {
        s += 'radera';
    }
    s += '">';
    if (curr_JerseyNo != 'radera'){
        s += Math.abs(curr_JerseyNo);
    } else {
        s += 'radera';
    }
      s += '</button>';

      tmp = 'cell' + Rad + '_' + Kolumn;
      document.getElementById(tmp).innerHTML = s;

}
function matchEditeras(index) {

    if (EditDomare[0] == -1) return false; // ingen match editeras.


    if (EditDomare[0] != index) return true; // annan match editeras.


    return false; // Editering av samma match fortsätter

}

function angraEditering(Rad,Kolumn) {
    EditDomare[Kolumn] = -1;
    if (EditDomare[1] == -1 && EditDomare[2] == -1 && EditDomare[3] == -1 && EditDomare[4] == -1 && EditDomare[5] == -1){

        EditDomare[0] = -1;

        // Ta bort Spara-knappen
        var id = 'savecell' + String(Rad) ;
        document.getElementById(id).innerHTML = '';
    }
}

function visaKnapp(Rad,Kolumn,Domartyp) {
    var s = '<td id="cell' + String(Rad) + '_' + Kolumn + '">';
    s += visa_OrigKnapp(Rad,Kolumn,Domartyp);
    s += '</td>';
    return s;
}

function visa_OrigKnapp(Rad,Kolumn,Domartyp) {
      var s = '<button type="button"  id="knapp' + String(Rad) + '_' + Kolumn + '" class="';
    var JerseyNo;
    if (Kolumn == 1){
        JerseyNo = Matchlista.Match[Rad].HD1;
    } else if (Kolumn == 2){
        JerseyNo = Matchlista.Match[Rad].HD2;
    } else if (Kolumn == 3){
        JerseyNo = Matchlista.Match[Rad].LD1;
    } else if (Kolumn == 4){
        JerseyNo = Matchlista.Match[Rad].LD2;
    } else if (Kolumn == 5){
        JerseyNo = Matchlista.Match[Rad].Dcoach;
    }

      if (JerseyNo){
          if (JerseyNo > 0){
                s += 'btn btn-primary';
          } else {
                s += 'btn btn-danger';
          }
      } else {
          s += 'btn btn-warning';
      }
      s += '" onclick="hamta_domare(' + String(Rad) + ', ' + Kolumn + ',' + Domartyp + ')"';
      if (Inaktiv) s += ' disabled';
      if (JerseyNo){
          s += ' title="' + getDomare(JerseyNo) + '"';
    }
    s += ' value="';
      if (JerseyNo){
        s += Math.abs(JerseyNo);
    } else {
        s += '';
    }
    s += '">';
      if (JerseyNo){
        s += Math.abs(JerseyNo);
    }
      s += '</button>';

    return s;
}

//Javascript File

var Matchlista   = [];
var LedigaDomare = [];

var Dagens       = '';
var Inaktiv      = false;


var EditDomare   = [];
EditDomare[0]    = -1; // Radnr på match som editering har påbörjats
EditDomare[1]    = -1; // HD1
EditDomare[2]    = -1; // HD2
EditDomare[3]    = -1; // LD1
EditDomare[4]    = -1; // LD2
EditDomare[5]    = -1; // Dcoach


var AllaDomare     = [];


initiera();
