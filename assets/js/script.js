$(".fc").hide();
var searchButton = document.querySelector("#searchBtn");

function getCurrentWeather() {
    try {
        var city = document.querySelector("#city").value;
        var apiKey = '18bb77d524842388b83512049fe6a263';
        var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
        if (city) {
            fetch(currentUrl)
                .then(data => data.json())
                .then(res => {
                    var weather = res;
                    var name = document.getElementById("name");
                    var date = moment().format('MM/DD/YYYY');
                    var iconId = weather.weather[0].icon;
                    var icon = '<img src="https://openweathermap.org/img/w/' + iconId + '.png" />'
                    name.innerHTML = weather.name + " " + "(" + date + ")" + icon;
                    var tempC = weather.main.temp - 273.15;
                    tempC = tempC.toFixed(0);
                    var temp = document.getElementById("temp");
                    temp.textContent = "Temp: " + tempC + "°C";
                    var wind = document.getElementById("wind");
                    wind.textContent = "Wind: " + weather.wind.speed + " MPH";
                    var humidity = document.getElementById("humidity");
                    humidity.textContent = "Humidity: " + weather.main.humidity + "%";
                    var lat = weather.coord.lat;
                    var lon = weather.coord.lon;
                    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + apiKey)
                        .then(data => data.json())
                        .then(res => {
                            var uvi = Number(res.current.uvi);
                            var uvElement = document.createElement("p");
                            uvElement.textContent = uvi;
                            uvElement.style.display = "inline-block";
                            var uvIndex = document.getElementById('uv');
                            uvIndex.innerHTML = "UV Index: ";
                            if (uvi <= 2) {
                                uvElement.style.backgroundColor = "green";
                                uvElement.style.color = "white";
                            }
                            else if (uvi > 2 && uvi <= 5) {
                                uvElement.style.backgroundColor = "yellow";
                                uvElement.style.color = "black";
                            }
                            else if (uvi > 5) {
                                uvElement.style.backgroundColor = "red";
                                uvElement.style.color = "white";
                            }
                            uvIndex.appendChild(uvElement);
                        })
                })


        }
    }
    catch (err) {
        console.log(err);
    }
}

function getForecast() {
    try {
        var city = document.querySelector("#city").value;
        if (city !== "") {
            document.getElementById("forecastDiv").innerHTML = "";
            var apiKey = '18bb77d524842388b83512049fe6a263';
            var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
            fetch(forecastUrl)
                .then(data => data.json())
                .then(res => {
                    var forecast = res;
                    console.log(res);
                    var forecastData = forecast.list;
                    for (i in forecastData) {
                        if (i == 7 || i == 15 || i == 23 || i == 31 | i == 39) {
                            var card = document.createElement("div");
                            card.className = "card text-white bg-info mb-3 ml-2 mr-2 mt-4";
                            card.style.width = "10rem;"
                            var cardHeader = document.createElement("div");
                            cardHeader.className = "card-header";
                            var forecastDate = forecastData[i].dt_txt;
                            var date = forecastDate.slice(0, 10);
                            cardHeader.textContent = date;
                            var cardBody = document.createElement("div");
                            cardBody.className = "card-body";
                            var dayTemp = document.createElement("p");
                            dayTemp.className = "card-text";
                            var tempC = forecastData[i].main.temp - 273.15;
                            tempC = tempC.toFixed(0);
                            dayTemp.textContent = "Temp: " + tempC + "°C";
                            var dayWind = document.createElement("p");
                            dayWind.className = "card-text";
                            dayWind.textContent = "Wind: " + forecastData[i].wind.speed + " MPH";
                            var dayHumidity = document.createElement("p");
                            dayHumidity.className = "card-text";
                            dayHumidity.textContent = "Humidity: " + forecastData[i].main.humidity + "%";
                            var iconId = forecastData[i].weather[0].icon;
                            var iconUrl = 'https://openweathermap.org/img/w/' + iconId + '.png';
                            var newImage = document.createElement("img");
                            newImage.src = iconUrl;
                            card.appendChild(cardHeader);
                            cardHeader.append(newImage);
                            card.appendChild(cardBody);
                            cardBody.appendChild(dayTemp);
                            cardBody.appendChild(dayWind);
                            cardBody.appendChild(dayHumidity);
                            var forecastDiv = document.querySelector("#forecastDiv");
                            forecastDiv.appendChild(card);
                        }
                    }

                    if (forecast.cod === "200") {
                        $(".fc").show();
                        $("#currentDay").show();
                    }
                    else {
                        $(".fc").hide();
                        $("#currentDay").hide();
                    }

                })

        }
    }
    catch (err) {
        console.log(err);
    }
}

function saveSearchHistory() {
    document.querySelectorAll('.history').forEach(item => item.remove());
    var city = document.querySelector("#city").value;
    if (city !== "") {
        if (JSON.parse(localStorage.getItem("cities"))) {
            var savedCities = JSON.parse(localStorage.getItem("cities"));
            if (savedCities.length < 8 && savedCities.includes(city) == false) {
                savedCities.push(city);
                localStorage.setItem("cities", JSON.stringify(savedCities));
            }
            else if (savedCities.length === 8 && savedCities.includes(city) == false) {
                savedCities.shift();
                savedCities.push(city);
                localStorage.setItem("cities", JSON.stringify(savedCities));
            }
        }
        else {
            var savedCities = [city];
            localStorage.setItem("cities", JSON.stringify(savedCities));
        }
    }
}

function displayHistory() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    for (i in savedCities) {
        if (savedCities[i] !== "") {
            var historyBtn = document.createElement("button");
            historyBtn.type = "button";
            historyBtn.className = "btn btn-secondary form-control mt-2 mb-2 history"
            historyBtn.innerHTML = savedCities[i];
            $('.searchArea').append(historyBtn);
        }
    }
}

function update() {
    getCurrentWeather();
    getForecast();
    saveSearchHistory();
    displayHistory();
}

searchButton.addEventListener("click", function () {
    update();
})

$('.searchArea').on('click', '.history', (function () {
    document.querySelector("#city").value = $(this).html();
    update();
}))

$('#city').click(function () {
    $(this).val("");
})

$('#city').keypress(function (event) {

    if (event.keyCode === 13) {

        event.preventDefault();

        $("#searchBtn").click();
    }
});

displayHistory();


