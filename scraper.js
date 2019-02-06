const request = require("request");
const cheerio = require("cheerio");

let counter = 1;
let times = 0;
let retry = [];

// MODIFICAR ESTO
let maxTimes = 10; // Maximo de reintentos
let total = 20; //9568; // Total de actas

scrape = () => {
  // Generate URL to request, the base + the number of JRV
  let Uri =
    "https://eleccion2019.tse.gob.sv/Consolidacion/DetalleJRV/" +
    counter +
    "/525";

  console.log("Buscando acta " + counter.toString());

  request(Uri, (error, response, html) => {
    // Make sure it has a website loaded.
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      // Location details:
      // 0 Departamento
      // 1 Municipio
      // 2 Centro de Votación
      // 3 Número de JVR

      // Votes details:
      // 0 Votos primer lugar en esa JRV
      // 1 Votos segundo lugar en esa JRV
      // 2 Votos tercer lugar en esa JRV
      // 3 Votos cuarto lugar en esa JRV

      // Partidos details:
      // 0 Partido que finalizó en primer lugar en JRV
      // 0 Partido que finalizó en segundo lugar en JRV
      // 0 Partido que finalizó en tercer lugar en JRV
      // 0 Partido que finalizó en cuarto lugar en JRV

      // Coalición details:
      // 0 Partido de Coalición que finalizó en primer lugar en JRV
      // 1 Partido de Coalición que finalizó en segundo lugar en JRV
      // 2 Partido de Coalición que finalizó en tercer lugar en JRV
      // 3 Partido de Coalición que finalizó en cuarto lugar en JRV
      // 4 Partido de Coalición que finalizó en quinto lugar en JRV

      // Arrays
      const location = [];
      const votes = [];
      const partido = [];
      const coalicion = [];

      // Guarda la ubicación en array
      $(".dropdown-toggle b").each((i, el) => {
        location.push($(el).text());
      });

      // Guarda todos los valores de votos en array
      $(".panel .media-body .text-right").each((i, el) => {
        // Asigna y limpia votos
        const cleanVotes = $(el)
          .text()
          .trim();
        // Cuenta los chars y resta 6 para enviar únicamente los números al array;
        const len = cleanVotes.length;
        const dist = len - 6;

        votes.push(cleanVotes.substr(0, dist));
      });

      // Guarda el orden de los 4 partidos participando en la eleccion
      $(".media-left img").each((i, el) => {
        partido.push($(el).attr("title"));

        const votosPart = $(".text-right").text();
        console.log(votosPart);
      });

      // Guarda el orden de los 5 partidos de coalición
      $(".media-heading img").each((i, el) => {
        coalicion.push($(el).attr("title"));
      });

      const jrvData = {
        numeroJrv: counter,
        ubicacion: {
          departamento: location[0],
          municipio: location[1],
          centroVotacion: location[2]
        }
        // 'partidos': {
        //   'nombre1': partido[0],
        //   'votos1': votes[0],
        //   'nombre2': partido[1],
        //   'votos2': votes[1],
        //   'nombre3': partido[2],
        //   'votos3': votes[2],
        //   'nombre4': partido[3],
        //   'votos4': votes[3],
        // },
        // 'coalition': {
        //   'nombre1': coalicion[0]

        // }
      };

      console.log(jrvData);
    }
  });
};

// Calls the start of the function.
scrape();
