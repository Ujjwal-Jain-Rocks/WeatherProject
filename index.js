const http = require('http');
const fs  = require('fs')
var requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");

const changeKtoC = (val) => {
    var cal = Math.round((val-273.15)*100)/100;
    return cal + " &#8451";
};
const formatDate = (val) => {
    var date = new Date(val * 1000).toLocaleTimeString('en-ES');
    return date;
};

const replacefuc = (data, values) => {
    data = data.replace("{%temp%}", changeKtoC(values.main.temp));
    data = data.replace("{%min%}", changeKtoC(values.main.temp_min));
    data = data.replace("{%max%}", changeKtoC(values.main.temp_max));
    data = data.replace("{%country%}", values.name);
    data = data.replace("{%humid%}", values.main.humidity+"%");
    data = data.replace("{%rise%}", formatDate(values.sys.sunrise));
    data = data.replace("{%set%}", formatDate(values.sys.sunset));
    return data;
};

const server = http.createServer((req, res) => {
  
    if(req.url != "/" && req.url != "/favicon.ico") {
        requests('http://api.openweathermap.org/data/2.5/weather?q='+req.url.replace("/","")+'&appid=ff1b1dabffac186c650b679b96d3878d')
            .on('data', (chunk) => {
                // console.log(req.url.replace("/",""));
                const objdata = JSON.parse(chunk);
                const data = replacefuc(homeFile, objdata);
                res.write(data);
            })
            .on('end', (err) => {
                if (err) 
                    return console.log('connection closed due to errors', err); 
                else 
                    res.end();
        });
    }
});
server.listen(3000);