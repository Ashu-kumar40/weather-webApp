const container = document.querySelector('.container'),
inputSec = container.querySelector('.input-sec'),
content = inputSec.querySelector('.content'),
msg = content.querySelector('.msg'),
inputArea = content.querySelector('#input-location');
locationBtn = content.querySelector('.search')
const apiKey = "404a51a925bd942277ef7a70302bfb24";
let api;
const weatherIcon = container.querySelector('.weather-page img')
const backBtn = container.querySelector('header .back');

inputArea.addEventListener('keyup', e=>{
    // if user pressed enter and input value is not empty
    if(e.key == 'Enter' && inputArea.value != ""){
        requestApi(inputArea.value);
    }
});


locationBtn.addEventListener("click", e =>{
    if(navigator.geolocation){// if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSucces, onError);
    }
    else{
        alert("Your browser does not support geolocation Api");
    }
})

function onSucces(postion){
    // getting the lat and lon of the user device from the coord obj
    const {latitude, longitude} = postion.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData();
}

function onError(error){
    msg.innerHTML = error.message;
    msg.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    //&units=metric in api is for celcius value of temp
    fetchData();
}

function fetchData(){
    msg.innerHTML = "please wait..."
    msg.classList.add("pending");

    fetch(api).then(response => response.json()).then(result => weatherInfo(result)); 
}


function weatherInfo(info){
    msg.classList.replace("pending", "error");
    if(info.cod === "404"){
        msg.innerHTML = `${info.message}`;
    }
    else{
        // when we got the date from the api we will hide the msg
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id === 800){
            weatherIcon.src = "./assets/weather-info/clear.png"
        }
        else if(id >= 200 && id <=232){
            weatherIcon.src = "./assets/weather-info/storm.gif"
        }
        else if(id >= 600 && id <= 622){
            weatherIcon.src = "./assets/weather-info/snowflake.gif"
        }
        else if(id >= 701 && id <= 781){
            weatherIcon.src = "./assets/weather-info/haze.png"
        }
        else if(id >= 801 && id <= 804){
            weatherIcon.src = "./assets/weather-info/clouds.gif"
        }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            weatherIcon.src = "./assets/weather-info/rain.gif"
        }


        // passing the values to a particular elements
        container.querySelector('.temp .num').innerText = Math.floor(temp) ;
        container.querySelector('.humidity .num').innerText = humidity;
        container.querySelector('.details .num').innerText = Math.floor(feels_like);
        container.querySelector('.weatherCondition').innerText = description;
        container.querySelector('.location-info .location').innerText = `${city}, ${country}`;

        msg.classList.remove("pending","error")
        container.classList.add("active")
        console.log(info);
    }
}

backBtn.addEventListener("click",()=>{
    container.classList.remove("active")
});