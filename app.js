let weekdayCols = document.querySelectorAll(".col"); //Selecting all columns so i can put a day of the week in each.

function celsiusToFarenheit(temperature)//Function i will use later once I have the data from the API
{
    let convertedTemp = (temperature * 9/5) + 32;
    let result= Math.round(convertedTemp * 100) / 100;
    return result;
}

function farenheitToCelsius(temperature)
{
    let convertedTemp = (temperature - 32) * 5/9;
    let result= Math.round(convertedTemp * 100) / 100;
    return result;
}

//GET COORDINATES
const findMe = () => { //sends the webpage a notice to ask for permission to get the user current location.

    const success = (position) =>
    {
    console.log(position);
    status.textContent = "success";
    const { latitude, longitude } = position.coords;

    GetPointData(latitude,longitude)
    };
    const error = () => {
    };
    navigator.geolocation.getCurrentPosition(success, error);
};
findMe();

async function GetPointData(latitude,longitude) //Self explanitory
{  
    let url = `https://api.weather.gov/points/${latitude},${longitude}`
    await fetch(url)
    .then(response => response.json())
    .then(data =>
    {
        console.log(data);
        let gridId = data.properties.gridId; //Saving data from API to a variable to use in my program.
        let grid_X = data.properties.gridX;
        let grid_Y = data.properties.gridY;
        GetGridPoints(gridId,grid_X,grid_Y)
    })
    .catch(error =>
    {
        console.log(error)
    });
}

async function GetGridPoints(gridId,grid_X,grid_Y) //Using the latitude and longitude this data gets and displays the weather in the location area.
{  
    let url = `https://api.weather.gov/gridpoints/${gridId}/${grid_X},${grid_Y}/forecast`
    await fetch(url)
    .then(response => response.json())
    .then(data =>
    {
        console.log(data);
        for (let i = 0; i < data.properties.periods.length; i++)
        {   
            //saving individual data properties to variables         
            let weekDay = data.properties.periods[i].name; 
            let temp = data.properties.periods[i].temperature; 
            let tempUnit = data.properties.periods[i].temperatureUnit; 
            let description = data.properties.periods[i].shortForecast;
            let icon = data.properties.periods[i].icon;
            //making p tags to hold the indivial variables so they can line up vertically on the webpage
            let pTagWeekDay = document.createElement("p");
            let pTagTemp = document.createElement("p");
            let pTagDescription = document.createElement("p");
            let pTagIcon = document.createElement("img");
            //Adding the variables into the p tags
            pTagWeekDay.append(weekDay);
            pTagTemp.append(`${temp}˚ ${tempUnit} (C/F)`); //temperaure and temp unit is installed in this tag to line up side by side.
            pTagDescription.append(description);
            pTagIcon.append(icon);
            pTagIcon.src = icon //making(converting) the link saved to show up as a image on the web page.
            //inserting the p-tags in the div/columns I made on the HTML page to hold the data for each day of the week.
            weekdayCols[i].append(pTagWeekDay);
            weekdayCols[i].append(pTagTemp);
            weekdayCols[i].append(pTagDescription);
            weekdayCols[i].append(pTagIcon);
            //this is event listener to change the temperature and temperature unit to celsius or farenheit
            pTagTemp.addEventListener("click", () =>
            {
                if (tempUnit == "F" || tempUnit == "f" ) //Convert farenheit to celsius
                {
                    temp = farenheitToCelsius(temp)
                    tempUnit = "C";
                    pTagTemp.innerHTML = `${temp}° ${tempUnit} (C/F)`;
                }
                else
                {
                    temp = celsiusToFarenheit(temp) //The opposite of above
                    tempUnit = "F";
                    pTagTemp.innerHTML = `${temp}° ${tempUnit} (C/F)`; 
                }
            })
        }
    })
    .catch(error =>
    {
        console.log(error)
    });
}