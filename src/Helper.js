

const countries =  {
    "Israel": { "lat": 31.0461, "lon": 34.8516 },
    "Europe": { "lat": 54.5260, "lon": 15.2551 },
    "China-Japan": { "lat": 35.8617, "lon": 114.1954 },
    "India": { "lat": 20.5937, "lon": 78.9629 },
    "Eritrea": { "lat": 15.1794, "lon": 39.7823 },
    "Mexico": { "lat": 23.6345, "lon": -102.5528},
    "Germany": { "lat": 51.1657, "lon": 10.4515},
    "France": { "lat": 46.2276, "lon": 2.2137},
    "Italy": { "lat": 41.8719, "lon":12.5674},
    "China":{"lat": 35.8617, "lon": 114.1954},
    "Japan":{"lat": 36.2048, "lon": 138.2529},
    "Philippines":{"lat":12.8797 , "lon": 121.7740},
     "Nepal" :{"lat":28.3949 , "lon":84.1240 },
    "Bangladesh" :{"lat":23.6850 , "lon": 90.3563},
    "Pakistan":{"lat":30.3753 , "lon":69.3451 },
    "Hungary":{ "lat": 51.1657, "lon": 10.4515},
     "Czech Republic":{ "lat": 51.1657, "lon": 10.4515}, "Estonia":{ "lat":56.8796, "lon": 24.6032}, "Latvia":{ "lat":56.8796, "lon": 24.6032},
      "Lithuania":{ "lat":56.8796, "lon": 24.6032},
       "Poland":{ "lat": 51.1657, "lon": 10.4515}, 
       "Slovakia":{"lat": 51.1657, "lon": 10.4515}, "Slovenia": {"lat": 51.1657, "lon": 10.4515}, "Ireland":{"lat": 53.1424, "lon": -7.6921},
        "Portugal":{"lat": 39.3999, "lon": -8.2245},
       "Central African Republic": {"lat":6.6111,"lon":20.9394},
       "Brazil":{"lat":-15.6280,"lon":-52.7226},
       "Cuba":{"lat":21.5218,"lon":- 77.7812},
       "Africa":{"lat":6.6111,"lon":20.9394},
       "South America":{"lat":-15.6280,"lon":-52.7226},
        "Central Asia": {"lat": 41.3775, "lon": 64.5853}
}
export function getCountryLocations(){
    return  countries
}

export function getLocation(country){
    return countries[country]
}