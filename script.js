const APIKEY = "cafede2797ebf92b71ba6a18195f6f78";
const cityInput = document.querySelector(".search-city");
const headerSearch = document.querySelector(".header__search");
const main = document.querySelector("#main");
const mainContainer = document.querySelector(".main__container");
const errShow = document.querySelector(".Error404");
let fiveDayBtn = document.querySelector(".nav__forecast");
let toDayBtn = document.querySelector(".nav__today");
let main_weather = document.querySelector(".main__current_weather");
const mainDaily = document.querySelector(".main__daily");
async function getWeatherData(cityName) {
  const fetchingData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=metric`
  );
  if (fetchingData.status === 404) {
    errShow.style.display = "flex";
    main.style.display = "none";
  } else {
    errShow.style.display = "none";
    main.style.display = "flex";
    const response = await fetchingData.json();
    showCurrentWeather(response);
    return response;
  }
}
try {
  let defaultCity = "Samarkand";
  getWeatherData(defaultCity);
  newFetch(defaultCity);
} catch (error) {
  console.log(error);
}
headerSearch.onsubmit = () => {
  event.preventDefault();
  let cityName = cityInput.value;
  getWeatherData(cityName);
  newFetch(cityName);
};
function showCurrentWeather(data) {
  let { weather, main, name, dt, id, sys, timezone, wind, coord } = data;
  const currentIcon = document.querySelector(".current__weather__image");
  const currentDeg = document.querySelector(".current__weather__deg");
  const currentFeels = document.querySelector(".current__weather__feelslike");
  const currentDate = document.querySelector(".current__weather__date");
  const currentDescription = document.querySelector(
    ".current__weather__description"
  );
  const currentTimeLapse = document.querySelector(
    ".current__weather__timelapse"
  );
  currentTimeLapse.innerHTML = ` 
       <li><span>Sunrise</span>: ${new Date(
         sys.sunrise * 1000
       ).toLocaleTimeString("en-US", { hour12: true })}</li>
       <li><span>Sunset</span>: ${new Date(
         sys.sunset * 1000
       ).toLocaleTimeString("en-US", { hour12: true })}</li>
       <li><span>Duration</span>: ${new Date(
         (sys.sunrise - sys.sunset) * 1000
       ).toLocaleTimeString()} hr</li>`;
  currentIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  currentDescription.textContent = weather[0].description;
  currentDeg.innerHTML = `${Math.round(main.temp)}&degC`;
  currentFeels.innerHTML = `Feels like ${Math.floor(main.feels_like)}&deg`;
  currentDate.textContent = new Date(dt * 1000).toLocaleDateString();
}
async function newFetch(cityPlace) {
  const fetchingData = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityPlace}&appid=&apikey=${APIKEY}&units=metric`
  );
  const response = await fetchingData.json();
  showHourlyWeather(response, 0);
  return response;
}
newFetch(cityInput.value).then((data) => {
  fiveDayBtn.onclick = () => ShowWeather(data);
});
function ShowWeather(data) {
  const dailyData = data;
  console.log(dailyData);
  main_weather.style.display = "none";
  mainDaily.style.display = "flex";

  let { list } = dailyData;
  let sortedDays = list.filter((i) => {
    if (i.dt_txt.slice(10, 13) == 15) {
      return i;
    }
  });

  let mainDailyContainer = "";
  sortedDays.forEach((i) => {
    let { weather, main, name, dt, id, sys, timezone, wind, coord } = i;
    mainDailyContainer += `
        <a href ="#" class="hourlyLink">
        <div class="main__daily_day">
        <h5>${new Date(dt * 1000).toLocaleDateString("en-US", {
          weekday: "long",
        })}</h5>
        <p>${new Date(dt * 1000).toLocaleString("en-In", {
          day: "numeric",
          month: "long",
        })}</p>
        <img src="https://openweathermap.org/img/wn/${
          weather[0].icon
        }@2x.png" alt="">
        <h2>${Math.round(main.temp)}&deg</h2>
        <p>${weather[0].main}</p>
        </div>
        </a>
        `;
  });
  mainDaily.innerHTML = mainDailyContainer;
  let linkhour = document.querySelectorAll(".hourlyLink");
  console.log(linkhour);
  for (let i = 0; i < 5; i++) {
    linkhour[i].addEventListener("click", (event) => {
      event.preventDefault();
      showHourlyWeather(dailyData, [i * 8]);
    });
  }
  activeStatus = false;
  toDayBtn.classList.remove("active_btn");
  fiveDayBtn.classList.add("active_btn");
}
function showHourlyWeather(data, indexBegin) {
  const hourlyContainer = document.querySelector(".hourly__weather__body");
  hourlyContainer.innerHTML = `
      <li class="hourly__weather__hour">
                <h4>TODAY</h4>
                <ul class="hourly__weather__indicators">
                  <li class="hourly__weather__indicator hour__forecast">Forecast</li>
                  <li class="hourly__weather__indicator hour__forecast">Temp(&degC)</li>
                  <li class="hourly__weather__indicator hour__forecast">RealFeel</li>
                  <li class="hourly__weather__indicator hour__forecast">Wind(km/h)</li>
                </ul>
              </li>`;
  let hourItem = "";
  for (let i = indexBegin; i < +indexBegin + 6; i++) {
    const temp = data.list[i].main.temp;
    const feelsLike = data.list[i].main.feels_like;
    const placeholder = data.city.name;
    cityInput.placeholder = placeholder;
    cityInput.value = "";
    const wind = data.list[i].wind.speed;
    const desc = data.list[i].weather[0].main;
    const icon = data.list[i].weather[0].icon;
    const unixTime = data.list[i].dt;
    const dateTime = new Date(unixTime * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
    hourItem += `
        <li class="hourly__weather__hour">
        <p class="hourly__day">${dateTime}</p>
        <div class='hourlyImage__container'>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png"  class="hourly__image"id="hourlyIcon">
        </div>
        <p class="hour__forecast">${desc}</p>
        <p class="hour__forecast">${Math.floor(temp)}°</p>
        <p class="hour__forecast">${Math.floor(feelsLike)}°</p>
        <p class="hour__forecast">${wind}</p>
        </li>
        `;
  }
  hourlyContainer.innerHTML += hourItem;
}
let activeStatus = false;
function showCurrent(event) {
  mainDaily.style.display = "none";
  main_weather.style.display = "block";
  activeStatus = true;
  fiveDayBtn.classList.remove("active_btn");
  event.target.classList.add("active_btn");
}
toDayBtn.addEventListener("click", showCurrent);
