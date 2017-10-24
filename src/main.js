$(document).ready(function () {
    // gets the user Lat and long values
    navigator.geolocation.getCurrentPosition(userResult, errorMessage);
});

function userResult(xyz) {
    "use strict";
    //Reverse Geo-coding to convert the lat and long values to the user city and state.
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + xyz.coords.latitude + "," + xyz.coords.longitude + "&key=AIzaSyAtSsANZMFQ16rwdZup7Bk5U-sSszA63bE",
    }).done(function (xyzResult) {
        // pass the city and state to the weather api to get the local weather.
        console.log("Google response below");
        let cityName = xyzResult.results["0"].address_components[4].long_name;
        let stateName = xyzResult.results["0"].address_components[5].long_name;
        let shortStateName = xyzResult.results["0"].address_components[5].short_name;
        console.log(cityName, stateName, shortStateName);
        $.ajax({
            url: "http://api.wunderground.com/api/525fe45aef36fb27/conditions/q/"+"/"+shortStateName+"/"+cityName+".json",
        }).done(function (apiResult) {
            outputHtml(apiResult);
        });
    });
}
function outputHtml(apiResult) {

    $("#apiResult").html(`
    <div class="col-md-8 d-flex justify-content-center">
       <span class="h3 mt-4">${apiResult.current_observation.display_location.full}</span>
    </div>
    <div class="col-md-8 d-flex justify-content-center mt-3">
        <h5>${apiResult.current_observation.weather}</h5><br>
        <img style="width: 20%" src="${apiResult.current_observation.icon_url}">
    </div>
    <div class="col-md-8 d-flex justify-content-center">
        <p class="h1 display-3" id="mainTemp">${apiResult.current_observation.temp_c}&degC</p>
        <span>
        <button id="changeTemp" class="btn btn-sm" style="border: 0; background-color: inherit; cursor: pointer" data-toggle="tooltip" data-placement="top" title="change value">
            ${apiResult.current_observation.temp_f} F</button></span>
    </div>
    
    <br>
    <div class="col-md-8">
        <ul class="list-group">
            <li class="list-group-item"><strong>Relative Humidity: </strong> ${apiResult.current_observation.relative_humidity}</li>
            <li class="list-group-item"><strong>Air Pressure: </strong> ${apiResult.current_observation.pressure_in}</li>
            <li class="list-group-item"><strong>Visibility(in "km"): </strong> ${apiResult.current_observation.visibility_km}</li>
            <li class="list-group-item"><strong>Wind Speed & Directions: </strong>${apiResult.current_observation.wind_degrees}&nbsp; ${apiResult.current_observation.wind_dir}, &nbsp;${apiResult.current_observation.wind_string}</li>
            <li class="list-group-item"><strong>Date and Time : </strong> ${apiResult.current_observation.local_time_rfc822}</li>
            <li class="list-group-item"><strong>Meteorological Observatory: </strong> ${apiResult.current_observation.observation_location.city}</li>
        </ul>
    </div>
    `);
    document.getElementById("changeTemp").addEventListener("click", changer);
    console.log(apiResult);
}

function changer() {
    let updater1 = document.getElementById("changeTemp").textContent;
    let mainTemp = document.getElementById("mainTemp").textContent;

    document.getElementById("mainTemp").textContent = updater1;
    document.getElementById("changeTemp").textContent = mainTemp;

}

function errorMessage() {
    alert("Please adjust your browser location settings to get the local weather conditions in your area.")
}