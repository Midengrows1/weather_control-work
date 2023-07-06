const APIKEY = "cafede2797ebf92b71ba6a18195f6f78";
const cityInput = document.querySelector(".search-city");
const headerSearch = document.querySelector(".header__search");
const main = document.querySelector("#main");
const mainContainer = document.querySelector(".main__container");
const errShow = document.querySelector(".Error404");
headerSearch.onsubmit = () => {
  const cityName = cityInput.value;
  event.preventDefault();
  const getWeatherData = async function () {
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
      return response;
    }
  };
  getWeatherData().then((data) => {
    const readyData = data;
    console.log(readyData);
    let { weather, main, name, dt, id, sys, timezone, wind, coord } = readyData;
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
     <li><span>Sunrise</span>: ${new Date(sys.sunrise * 1000)
       .toLocaleTimeString()
       .slice(0, 5)} AM</li>
     <li><span>Sunset</span>: ${new Date(sys.sunset * 1000)
       .toLocaleTimeString()
       .slice(0, 5)} PM</li>
     <li><span>Duration</span>: ${new Date((sys.sunset - sys.sunrise) * 1000)
       .toLocaleTimeString()
       .slice(0, 5)} hr</li>`;
    currentIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    currentDescription.textContent = weather[0].description;
    currentDeg.innerHTML = `${Math.round(main.temp)}&degC`;
    currentFeels.innerHTML = `Feels like ${Math.floor(main.feels_like)}&deg`;
    currentDate.textContent = new Date(dt * 1000).toLocaleDateString();
  });

  const newFetch = async function () {
    const fetchingData = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=&apikey=${APIKEY}&units=metric`
    );
    const response = await fetchingData.json();
    return response;
  };
  newFetch().then((data) => {
    const hourlyData = data;
    console.log(hourlyData);
    const hourlyWeather = document.querySelector(".hourly__weather__body");
    let { list } = hourlyData;
    for (let time = 0; time < 6; time++) {
      let dateTime = new Date(list[time].dt * 1000).toTimeString().slice(0, 5);
      let { main, weather, wind } = list[time];
      let leng = document.querySelectorAll(".hourly__weather__hour").length;
      if (leng > 5) {
        return;
      }
      let hourly_div = document.createElement("li");
      let hourly_inner = document.createElement("ul");
      hourly_div.classList.add("hourly__weather__hour");
      hourly_inner.classList.add("hourly__weather__inner");
      hourly_inner.innerHTML = `
      <li>${dateTime}</li>
      <li class ="hourly__image"><img src="https://openweathermap.org/img/wn/${
        list[time].weather[0].icon
      }@2x.png" alt=""></li>
      <li class="hour__forecast ">${weather[0].main}</li>
      <li class="hour__forecast">${Math.round(main.temp)}&deg</li>
      <li class="hour__forecast">${Math.round(main.feels_like)}&deg</li>
      <li class="hour__forecast">${Math.round(wind.speed)} SE</li>
      `;
      hourly_div.append(hourly_inner);
      hourlyWeather.append(hourly_div);
    }
  });
  fiveDayBtn = document.querySelector(".nav__forecast");
  toDayBtn = document.querySelector(".nav__today");
  toDayBtn = document.querySelector(".nav__today");
  let activeStatus = false;
  let notactiveStatus = false;
  function ShowWeather(event) {
    newFetch().then((data) => {
      const dailyData = data;
    });
  }
  toDayBtn.addEventListener("click", ShowWeather);
  fiveDayBtn.addEventListener("click", ShowWeather);
};
