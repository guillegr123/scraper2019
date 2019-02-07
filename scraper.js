const request = require("request");
const cheerio = require("cheerio");
const _ = require("lodash");

// MODIFICAR ESTO
let total = 10; //9568; // Total de actas
let array = _.range(total, 0);

scrape = () => {
  if (array.length === 0) return;

  var number = array.pop();
  let Uri =
    "https://eleccion2019.tse.gob.sv/Consolidacion/DetalleJRV/" +
    number +
    "/525";

  console.log("Buscando acta " + number.toString());

  request(Uri, (error, response, html) => {
    // Make sure it has a website loaded.
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const location = $(".dropdown-toggle b").map(function () { return $(this).text(); }).toArray();
      
      const filasResultados = $("#totalResultados tr");

      const acta = {
        departamento: location[0],
        municipio: location[1],
        lugar: location[2],
        jrv: location[3],
        resultados:
          _.chain(
              $(filasResultados).find('td:nth-child(odd)').map(function () {
                return $(this).text();
              }).toArray()
            ).zipWith(
              $(filasResultados).find('td:nth-child(even)').map(function () {
                return $(this).text();
              }).toArray(),
              (title, value) => {
                return {
                  titulo: title.trim(),
                  valor: _.toNumber(value)
                }
              })
            .filter(r => r.titulo.length > 0)
            .value()
      };

      console.log(acta);
    } else {
      array.unshift(number);
    }

    setImmediate(scrape);
  });
};

// Calls the start of the function.
scrape();
