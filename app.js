let weekdayCols = document.querySelectorAll(".col");
let removeImg = document.querySelectorAll(".container");
console.log(weekdayCols);
//GET COORDINATES
const findMe = () => {

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

async function GetPointData(latitude,longitude)
{  
    let url = `https://api.weather.gov/points/${latitude},${longitude}`
    await fetch(url)
    .then(response => response.json())
    .then(data =>
    {
        console.log(data);
        let gridId = data.properties.gridId;
        let grid_X = data.properties.gridX;
        let grid_Y = data.properties.gridY;
        console.log(gridId);
        console.log(grid_X);
        console.log(grid_Y);
        GetGridPoints(gridId,grid_X,grid_Y)
    })
    .catch(error =>
    {
        console.log(error)
    });
}

async function GetGridPoints(gridId,grid_X,grid_Y)
{  
    let url = `https://api.weather.gov/gridpoints/${gridId}/${grid_X},${grid_Y}/forecast`
    await fetch(url)
    .then(response => response.json())
    .then(data =>
    {
        console.log(data);
        for (let i = 0; i < data.properties.periods.length; i++)
        {
            console.log(data.properties.periods[i].name, data.properties.periods[i].temperature, data.properties.periods[i].shortForecast,data.properties.periods[i].icon);               
            let weekDay = data.properties.periods[i].name; 
            let temp = data.properties.periods[i].temperature; 
            let description = data.properties.periods[i].shortForecast;
            let icon = data.properties.periods[i].icon;
            let pTagWeekDay = document.createElement("p");
            let pTagTemp = document.createElement("p");
            let pTagDescription = document.createElement("p");
            let pTagIcon = document.createElement("img");
            pTagWeekDay.append(weekDay);
            pTagTemp.append(`${temp}˚`);
            pTagDescription.append(description);
            pTagIcon.append(icon);
            pTagIcon.src = icon
            weekdayCols[i].append(pTagWeekDay);
            weekdayCols[i].append(pTagTemp);
            weekdayCols[i].append(pTagDescription);
            // if (data.properties.periods[i].isDaytime == false)
            // {
            //     console.log("it is DARK!");

            // }
            // else {console.log("it is sunny")}
            weekdayCols[i].append(pTagIcon);
        }
    })
    .catch(error =>
    {
        console.log(error)
    });
}