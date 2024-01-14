let searchInput = document.getElementById('searchTxt');
let current_day = document.getElementById('day');
let current_date = document.getElementById('date');
let current_city = document.getElementById('city');
let daysNumcheckbox = document.getElementById('days');
let rowContent = document.getElementById('content');
let btnSearch = document.getElementById('btn-search');
let errorMsg = document.getElementById('errorMsg');
let loading = document.getElementById("loading");



let api;
let current;

// --*************loading ***************
function displayLoading(){
    console.log('dispaly')
    if(loading.classList.contains('d-none'))
    {
        console.log('remove-hide')
        loading.classList.remove('d-none');
    }
    console.log('add-display')
    loading.classList.add('d-display');
    // setTimeout(() => {
    //     loading.classList.remove('d-display');
    // }, (5000));


}
function hideloading()
{
    if(loading.classList.contains('d-display'))
    {
        loading.classList.remove('d-display');
    }
    loading.classList.add('d-none');


}
// *********checkbox*********************
if(daysNumcheckbox.checked == true)
{
    daysNum = daysNumcheckbox.value
}
else
{
    daysNum=4;
}

getLocation()

// ********* get current location weather *******************

async function getLocation()
    {
        displayLoading()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showCity);
          }
         else {

            if(errorMsg.classList.contains('d-none'))
            {
                errorMsg.classList.remove("d-none");
            }
            errorMsg.classList.add("d-display");
            errorMsg.innerHTML="Geolocation is not supported by this browser."
            
            
            
          }
          
          // Then, pass the location coordinates to a Geocoding API to get the city name
          function showCity(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
          
            // Make a request to a Geocoding API (e.g. Google Maps Geocoding API)
            const url = `https://api-bdc.net/data/reverse-geocode?latitude=${latitude} &longitude=${longitude}&localityLanguage=en&key=bdc_851f42a9e0174058804fdfbc84e2f751`;
          
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                
                hideloading();
                // Parse the city name from the API response
                getWeather(data.city)
                const city = data.results[0].address_components.find((component) =>
                  component.types.includes("locality")
                  
                ).long_name;
          
                console.log(`Your city is ${city}.`);
               
              })
              .catch((error) => console.log(error));
          }
        // const request = await fetch("https://ipinfo.io/json?token=42a943091e87c4")
        // const jsonResponse = await request.json()
        
        
        // getWeather(jsonResponse.city)

        
    
        
    }
 

 // ******** Event listners ***************
 
searchInput.addEventListener('keypress',function(e){
    if(e.key == 'Enter'){
        if(searchInput.value!='')
        {
            if(errorMsg.classList.contains('d-display'))
            {
                errorMsg.classList.remove("d-display");
            }
            errorMsg.classList.add("d-none");
            errorMsg.innerHTML = '';
        getWeather(searchInput.value)
        
        }
        
    }
  
})
daysNumcheckbox.addEventListener('change',function(){
    if(daysNumcheckbox.checked == true)
    {
        daysNum = daysNumcheckbox.value
    }
    else
    {
        daysNum=4;
    }
   
    if(searchInput.value!=='')
    {
        if(errorMsg.classList.contains('d-display'))
        {
            errorMsg.classList.remove("d-display");
        }
        errorMsg.classList.add("d-none");
        errorMsg.innerHTML = '';
        getWeather(searchInput.value)
    }
    else
    {
       
       
        getWeather(current)

    }
})

btnSearch.addEventListener('click',function(){
    if(daysNumcheckbox.checked == true)
    {
        daysNum = daysNumcheckbox.value
    }
    else
    {
        daysNum=4;
    }

if(searchInput.value!=='')
{
    if(errorMsg.classList.contains('d-display'))
    {
        errorMsg.classList.remove("d-display");
    }
    errorMsg.classList.add("d-none");
    errorMsg.innerHTML = '';
    getWeather(searchInput.value)
}
else
{
    if(errorMsg.classList.contains('d-none'))
    {
        errorMsg.classList.remove("d-none");
    }
    errorMsg.classList.add("d-display");
    errorMsg.innerHTML = 'Please Enter City Name';
    getWeather(current)
}
})

// ******** funtion get weather from api **********
async function getWeather(city)
{
    errorMsg.innerHTML ='';
  
    let result ;
    displayLoading()
    

    
        const apiResponse = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=7ae9fb3a443d411b96e164539240401 &q=${city}&days=${daysNum}&aqi=no&alerts=no`)
        console.log(apiResponse)
        if(apiResponse.ok)
        {
            result= await apiResponse.json();
            hideloading();
    




            let finalResult =  result['forecast'].forecastday;
            current_city.innerHTML = result.location.name;
            current = result.location.name;
            rowContent.innerHTML='';
            rowContent.innerHTML += ` <div class="col-md-12 ">
                <div class="current-box h-100 bg-dark bg-opacity-50 rounded  m-auto p-3">
                    <div class="">
                        <div class="header  d-flex justify-content-between align-content-center bg-dark  bg-opacity-50 text-white px-2 pt-2 rounded-top mt-2">
                            <p id="day">${getDayOfWeek(result.current.last_updated)}</p>
                            <p id="date">${new Date(result.current.last_updated).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div class="details px-2 text-center pb-2 mb-4 ">
                            
                            <h5  id="temp" class=" pt-1 text-center">${result.current.temp_c} 
                        
                            <span> <i class="fa-regular fa-circle degree p-0 "></i>C</span>  </h5>
                            <h5>${result.current.condition.text}</h5>
                        
                            <div class="d-flex justify-content-between align-items-center">
                        
                        
                            <h6>Sunrise</br></br> ${finalResult[0].astro.sunrise}</h6>
                            <img src='https://${result.current.condition.icon}' class="icon">
                            <h6>Sunset</br></br> ${finalResult[0].astro.sunset}</h6>

                            </div>
                        
                            <div class="d-flex justify-content-between align-content-center">
                                <h6>Humidity:<i class="fa fa-umbrella current-icon"></i><span>${result.current.humidity}</span></h6>
                                <h6>Wind:<i class="fa fa-wind current-icon"></i><span>${result.current.wind_kph}</span></h6>
                                <h6>Wind-dir:<i class="fa fa-compass current-icon"></i><span>${result.current.wind_dir}</span></h6>
                            </div>
                        </div>

                    </div>
                </div>
            `
            for(let i=1;i<finalResult.length;i++)
            {
                rowContent.innerHTML += `
                 <div class="col-md-4">
                    <div class="weather-box h-100 bg-dark bg-opacity-50 rounded  m-auto p-3 ">
                        <div class=" ">
                            <div class="header d-flex justify-content-between align-content-center bg-dark bg-opacity-75 text-white px-2 pt-2 rounded-top">
                                    <p id="day">${getDayOfWeek(finalResult[i].date)}</p>
                                    <p id="date">${new Date(finalResult[i].date).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div class="details px-2 text-center mb-4 mt-2">
                                
                            <h5  id="temp" class="text-center">${finalResult[i].day.maxtemp_c} 
                        
                            <span> <i class="fa-regular fa-circle degree p-0 "></i>C</span>
                            </h5>
                            <h5 class=""mb-2">${finalResult[i].day.condition.text}</h5>
                            <img src='https://${finalResult[i].day.condition.icon}' class="icon">
                            </div>

                        </div>
                    </div>
                </div>`
            }

            searchInput.value=''

        }
        
    
    
    else
    {
        hideloading();
    
        if(errorMsg.classList.contains('d-none'))
        {
            errorMsg.classList.remove("d-none");
        }
        errorMsg.classList.add("d-display");
        // console.log(error)
        if(apiResponse.status='400')
        {
            errorMsg.innerHTML = 'City is not exist.Please Check the name'       ;
            return;
        }
    }
    
}

// ************ function return day name from specific date*****************
function getDayOfWeek(date)
{
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day1 = new Date(date).getDay();
    return(days[day1])



}
