var button = document.querySelector("#searchBtn");

button.addEventListener("click", function () {
    var city = document.querySelector("#city").value;
    var apiKey = '18bb77d524842388b83512049fe6a263';
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    fetch(url)
        .then(data => data.json())
        .then(res => {
            console.log(res)
        })
})

