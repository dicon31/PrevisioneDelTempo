document.addEventListener("DOMContentLoaded", () => {

//Al caricamento della pagina facciamo la request ajax alla risorsa

let apiRoot= "https://raw.githubusercontent.com/pmontrasio/codici-stati/master/dist/countries.json"

/*
esempio di API delle previsioni del tempo: https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=3d8aa45f7271f6bcb67cba7a6b0896d7

L'indirizzo generico dove fa vedere solo i parametri è https://api.openweathermap.org/data/2.5/weather?q={city name},{country code 2 characters}&appid={API key}


*/

const inputCitta =document.getElementById("inputCitta")
const result = document.getElementById("result")

const xhr=new XMLHttpRequest();
xhr.open("GET", apiRoot)

xhr.addEventListener("readystatechange", () => {
    if(xhr.readyState ==4 && xhr.status == 200){
        let objResponse = JSON.parse(xhr.responseText)
        console.log(objResponse)
        const selectCitta = document.getElementById("selectCitta") //oggetto select

        //è un oggetto, dobbiamo fare la scansione, usiamo for..in

        for(let p in objResponse){
            selectCitta.innerHTML+=`
            <option value="${objResponse[p].iso3361_2_characters}">${objResponse[p].english_country_name}</option>`
        }
    }
});

xhr.send()

//================================================

//Evento submit della form

const form = document.getElementById("form")

form.addEventListener("submit", (e) => {

    e.preventDefault() //stoppiamo i dati

    //validare i dati 
    //effettuare la request alla seconda API

    console.log(inputCitta.value, selectCitta.value)
    if(inputCitta.value=="") {
        result.innerHTML = "Dati non validi. Riprova"
    }else{
        apiRoot= `https://api.openweathermap.org/data/2.5/weather?q=${inputCitta.value},${selectCitta.value}&appid=3d8aa45f7271f6bcb67cba7a6b0896d7`

    const xhr2 = new XMLHttpRequest()
    xhr2.open("GET", apiRoot)

    xhr2.addEventListener("readystatechange", () => {
    let objResponse    
        if(xhr2.readyState==4){
            if(xhr2.status==200){//la risposta è andata a buon fine
                //interpretiamo i risultati arrivati 
                objResponse= JSON.parse(xhr2.responseText)
                console.log(xhr2.responseText)
                result.innerHTML=`
                
                <h3>Situazione meteo su ${inputCitta.value} - ${selectCitta.value}</h3>
                <table class= "table table-bordered">
                    <tbody>
                        <tr>
                            <th>Situazione</th>
                            <td>${objResponse.weather[0].description}</td>
                        </tr>
                        
                        <tr>
                            <th>Temperatura (°C)</th>
                            <td>${kelvinToCelsius(objResponse.main.temp)}</td>
                        </tr>

                        <tr>
                            <th>Temperatura Min (°C)</th>
                            <td>${kelvinToCelsius(objResponse.main.temp_min)}</td>
                        </tr>

                        <tr>
                            <th>Temperatura Max (°C)</th>
                            <td>${kelvinToCelsius(objResponse.main.temp_max)}</td>
                        </tr>
                        <tr>
                            <th>Pressione</th>
                            <td>${objResponse.main.pressure} mbar</td>
                        </tr>
                        <tr>
                            <th>Umidità</th>
                            <td>${objResponse.main.humidity} %</td>
                        </tr>

                        <tr>
                            <th>Vento</th>
                            <td>${objResponse.wind.speed} m/s</td>
                        </tr>

                    </tbody>
                </table>

                `

            }else{
                //xhr2.status !== 200
                console.log(xhr2.status)
                console.log(xhr2.response)

                let response= JSON.parse(xhr2.response)
                result.innerHTML=`
                <h4>${response.cod} - ${response.message.toUpperCase()}</h4>
                `
            }
        }

    })

    xhr2.send()

    }
    
})


})

function kelvinToCelsius(kelvin){
    console.log(kelvin-273.15)
    return Math.round(kelvin-273.15) //troncamento all'intero più vicino
}