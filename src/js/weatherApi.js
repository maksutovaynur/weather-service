const API_KEY = "196acf3f5ea9c4b2460cd8a6ac650dd8";

export function callById(id, callback, errorCallback) {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${API_KEY}`;
    fetch(url).then(callback, errorCallback);
}


export function callByName(name, callback, errorCallback) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}`;
    fetch(url).then(callback, errorCallback);
}
