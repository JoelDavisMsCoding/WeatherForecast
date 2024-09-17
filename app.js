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
        }
    })
    .catch(error =>
    {
        console.log(error)
    });
}