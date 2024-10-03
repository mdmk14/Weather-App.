const userTab=document.querySelector("[your-weather]");
const searchTab=document.querySelector("[search-weather]");
const grantAccess=document.querySelector(".grantAcces");
const searchForm=document.querySelector("[data-searchForm]");
const WeatherInfo=document.querySelector(".weatherDetail");
const loader=document.querySelector(".loade");
let curentTab=userTab;
const API_KEY = "fa151cadfe95dddeefd1b864d08e1945";
getLocation();
curentTab.classList.add("current-Tab");
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
function switchTab(clickedTab){
    if(clickedTab!=curentTab){
        curentTab.classList.remove("current-Tab");
        curentTab=clickedTab;
        curentTab.classList.add("current-Tab");
    
    if(!searchTab.classList.contains("active")){
        grantAccess.classList.remove("active");
        WeatherInfo.classList.remove("active");
        searchForm.classList.add("remove");
    }
    else{
        
        searchForm.classList.remove("active");
        WeatherInfo.classList.remove("active");
        getFromSessionStorage();
    }
}
}
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates")
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates)
{
    const {lat ,long}=coordinates;
    grantAccess.classList.remove("active");
    loader.classList.add("active");
    try{
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    const data=await response.JSON();
    loader.classList.remove("active");
    WeatherInfo.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(e){
        loader.classList.remove("active");
        // notFound.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation()
{
    if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else{
            alert("location not support");
        }
}
function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        long:position.coords.longitude,
    };
    sessionStorage.setItem("userCoordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    
    WeatherInfo.classList.remove("active");

    grantAccess.classList.remove("active");
    loader.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loader.classList.remove("active");
        WeatherInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loader.classList.remove("active");
        alert("erraor");   
    }
} 


