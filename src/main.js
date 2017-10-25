$(document).ready(function () {
    // gets the user Lat and long values
    navigator.geolocation.getCurrentPosition(userResult, errorMessage);
});
// Do not touch the lines of codes from [6-28]!!
function userResult(xyz) {
    "use strict";
    // Dont touch this line of code!!
    // Reverse Geo-coding to convert the lat and long values to the user city and state.
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + xyz.coords.latitude + "," + xyz.coords.longitude + "&key=AIzaSyAtSsANZMFQ16rwdZup7Bk5U-sSszA63bE",
    }).done(function (xyzResult) {
        let cityName = xyzResult.results["0"].address_components[1].long_name; //declared from response from google
        // pass the city and state to the weather api to get the local weather.
        $.ajax({
            url: "https://api.apixu.com/v1/forecast.json?key=26ce8308108545bfbaa122447172510&q="+cityName+"&days=2",
        }).done(function (apiResult) {
            outputHtml(apiResult);
        });
    });
}
function outputHtml(apiResult) {
    let userTime = new Date().getHours()+1;
    let tempTime = "0";
    if (userTime === 24){
        userTime = tempTime;
    }


    $("#apiResult").html(`
    <div class="col-md-8 d-flex justify-content-center">
       <span class="h4 mt-4">${apiResult.location.name},&nbsp;${apiResult.location.region}</span>
    </div>
    <div class="col-md-8 d-flex justify-content-center mt-3">
        <h5>${apiResult.current.condition.text}</h5><br>
        <img style="width: 20%" src="${apiResult.current.condition.icon}">
    </div>
    <div class="col-md-8 d-flex justify-content-center">
        <p class="h1 display-3" id="mainTemp">${apiResult.current.temp_c}&degC</p>
        <span>
        <button id="changeTemp" class="btn btn-sm" style="border: 0; background-color: inherit; cursor: pointer" data-toggle="tooltip" data-placement="top" title="change value">
            ${apiResult.current.temp_f} F</button></span>
    </div>
    
    <br>
    <div class="col-md-8 mb-3">
        <ul class="list-group" >
            <li class="list-group-item"><strong>Relative Humidity: </strong> ${apiResult.current.humidity}%</li>
            <li class="list-group-item"><strong>Air Pressure: </strong> ${apiResult.current.pressure_in}in</li>
            <li class="list-group-item"><strong>Visibility: </strong> ${apiResult.current.vis_km}km</li>
            <li class="list-group-item"><strong>Wind Speed & Direction: </strong>${apiResult.current.wind_kph}kph, ${apiResult.current.wind_degree}&deg ${apiResult.current.wind_dir}</li>
        </ul>
    </div><br>
    <div class="col-md-8">
        <ul class="list-group">
            <li class="list-group-item d-flex justify-content-center list-group-item-primary""><strong>NEXT DAY FORECAST<br><span class="d-flex justify-content-center">${apiResult.forecast.forecastday[1].date}</span></strong>  </li>
            <li class="list-group-item "><strong>Conditions: &nbsp;</strong><span class="d-flex justify-content-center"> ${apiResult.forecast.forecastday[1].day.condition.text} <img src="${apiResult.forecast.forecastday[1].day.condition.icon}"></span> </li>
            <li class="list-group-item"><strong>Average Temperature: &nbsp;</strong>${apiResult.forecast.forecastday[1].day.avgtemp_c}&degC. &nbsp;${apiResult.forecast.forecastday[1].day.avgtemp_f} F</li>
            <li class="list-group-item"><strong>Average Humidity: &nbsp;</strong> ${apiResult.forecast.forecastday[1].day.avghumidity} </li>
            <li class="list-group-item"><strong>Average Visibility: &nbsp;</strong> ${apiResult.forecast.forecastday[1].day.avgvis_km}km. &nbsp; ${apiResult.forecast.forecastday[1].day.avgvis_miles}miles</li>
            <li class="list-group-item"><strong>Wind Speed: &nbsp;</strong>${apiResult.forecast.forecastday[1].day.maxwind_kph}kph </li>
            <li class="list-group-item"><strong>Heat Index: &nbsp;</strong>${apiResult.forecast.forecastday[1].hour[userTime].heatindex_c}&degC. &nbsp; ${apiResult.forecast.forecastday[1].hour[userTime].heatindex_f} F</li>
            <li class="list-group-item"><strong>Probability for Rainfall or Snow: &nbsp;</strong>${apiResult.forecast.forecastday[1].hour[userTime].chance_of_rain}.${apiResult.forecast.forecastday[1].hour[userTime].chance_of_snow} </li>
        </ul>
    </div>
    `);
    document.getElementById("changeTemp").addEventListener("click", changer);
    console.log(apiResult);
    console.log(userTime);
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