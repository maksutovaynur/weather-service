import React, {Component} from "react";
import '../styles/weather.css';
import {callById, callByName} from "./weatherApi";


function WeatherResult ({result}) {
    if (!result) {
        return (<div className="weather-result"/>)
    }
    let weather = result.weather;
    weather = weather.length ? weather[0].description : "nunknown";
    const {humidity, temp_min, feels_like} = result.main;
    const speed = result.wind.speed;
    let recommendation = "";
    if (feels_like > 303) recommendation += "It's hot, wear T-short. ";
    else if (feels_like > 291) recommendation += "Warm, wear a shirt! ";
    else if (feels_like > 283) recommendation += "Coldy, wear a jacket! ";
    else if (feels_like > 275) recommendation += "Coold, wear a jacket and warm shoes! ";
    else recommendation += "Freezes, better stay home! ";

    if (humidity > 80) recommendation += "There is a chance of rain, please use an umbrella!"
    return (<div className="weather-result">
        <table>
            <tr><td><b>Weather in general:</b></td><td>{weather}</td></tr>
            <tr><td>Temperature:</td><td>{(temp_min - 273.15).toFixed(1)} oC</td></tr>
            <tr><td>Wind speed:</td><td>{speed} м/с</td></tr>
            <tr><td>Humidity:</td><td>{humidity}%</td></tr>
            <tr><td><b>Recommentations:</b></td><td>{recommendation || "unknown"}</td></tr>
        </table>
    </div>)
}


export class WeatherComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            city: "",
            options: [],
            selectedOptions: [],
            result: null,
            error: null,
            inChange: false
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const resultCallback = async (x) => {
            let result = await x.json();
            this.setState({result});
        }
        const errorCallback = async (x) => {
            let error = await x.json();
            this.setState({error});
        }
        const sel = this.state.selectedOptions;
        const city = this.state.city;
        if (sel.length > 0) {
            if (sel[0].name === city)
                callById(sel[0].id, resultCallback, errorCallback);
            else callByName(city, resultCallback, errorCallback);
        }
    }

    filterOptions = (city) => {
        let lcity = (city || "").toLowerCase();
        this.setState(function ({options}) {
            let selectedOptions = options.filter(
                ({name}) => name.toLowerCase().includes(lcity)
            ).slice(0, 10);

            return { city, selectedOptions }
        });
    }

    onChangeCity = (e) => {
        this.setState({ inChange: true })
        this.filterOptions(e.target.value);
    }

    componentDidMount() {
        let dataFunc = async (result) => {
            let data = JSON.parse(await result.text());
            console.log(`type=${typeof data}; [0]=${data[0]}; Result=${data}`);
            let lst = data.map((v) => ({id: v[0], name: v[1]}));
            this.setState(({options}) => ({options: options.concat(lst)}));
        }
        function errFunc(error) {
            console.log(`Err: ${JSON.stringify(error)}`)
        }
        fetch("/data/latin_rus.json").then(dataFunc, errFunc);
        fetch("/data/latin_norus.json").then(dataFunc, errFunc);
    }

    render(){
        let { selectedOptions, city } = this.state;
        let isFinal = (selectedOptions.length === 1) && selectedOptions[0].name === city;
        return (<div className="weather-root">
            <form onSubmit={this.onSubmit}>
                <input type="text" className="weather-input"
                    placeholder="Enter your city"
                    value={this.state.city}
                    onChange={this.onChangeCity}/>
                <input className="weather-button" type="submit" value="Search" disabled={city.length == 0}/>
            </form>
            <div className="weather-under">
                <ul className="weather-hints">
                    { ! isFinal && this.state.inChange &&
                        selectedOptions.map(({ id, name }) => (
                        <li key={id}
                            className="weather-hints-item"
                            onClick={() => { this.filterOptions(name); this.setState({inChange: false})}}
                        >
                            {name}
                        </li>
                    )) }
                </ul>
                <WeatherResult result={this.state.result}/>
            </div>
        </div>)
    }
}
