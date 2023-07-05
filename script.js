const APIKEY = "cafede2797ebf92b71ba6a18195f6f78";
const cityName = "Samarkand";
const getWeatherData = async function () {
  const fetchingData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=metric`
  );
  const response = await fetchingData.json();
  return response;
};

getWeatherData().then((data) => {
  const readyData = data;
  console.log(readyData);
  let { weather, main, name, dt, id, sys, timezone, wind } = readyData;
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
   <li><span>Sunrise</span>7:04 AM</li>
   <li><span>Sunset</span>7:04 AM</li>
   <li><span>Duration</span>7:04 AM</li>`;
  currentIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  currentDescription.textContent = weather[0].description;
  currentDeg.innerHTML = `${Math.round(main.temp)}&degC`;
  currentFeels.textContent = `Feels like ${main.feels_like}`
});
