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

      // Arrays
      const location = [];
      const votes = [];
      const partido = [];
      const coalicion = [];

      // Variables para asignar votos a partidos
      let part1, part2, part3, part4;
      let coal1, coal2, coal3, coal4, coal5;

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
      });

      // Guarda el orden de los 5 partidos de coalición
      $(".media-heading img").each((i, el) => {
        coalicion.push($(el).attr("title"));
      });

      // Verifica el index de ""
      const coalIndex = partido.indexOf("COALICIÓN");

      switch (coalIndex) {
        case 1: {
          part1 = 0;
          part2 = 6;
          part3 = 7;
          part4 = 8;
          coal1 = 1;
          coal2 = 2;
          coal3 = 3;
          coal4 = 4;
          coal5 = 5;
        }
        case 2: {
          part1 = 0;
          part2 = 1;
          part3 = 7;
          part4 = 8;
          coal1 = 2;
          coal2 = 3;
          coal3 = 4;
          coal4 = 5;
          coal5 = 6;
        }
        case 3: {
          part1 = 0;
          part2 = 1;
          part3 = 2;
          part4 = 8;
          coal1 = 3;
          coal2 = 4;
          coal3 = 5;
          coal4 = 6;
          coal5 = 7;
        }
        case 4: {
          part1 = 0;
          part2 = 1;
          part3 = 2;
          part4 = 3;
          coal1 = 4;
          coal2 = 5;
          coal3 = 6;
          coal4 = 7;
          coal5 = 8;
        }
      }

      const jrvData = {
        numeroJrv: counter,
        ubicacion: {
          departamento: location[0],
          municipio: location[1],
          centroVotacion: location[2]
        },
        partidos: {
          partido1: partido[0],
          votos1: votes[part1],
          partido2: partido[1],
          votos2: votes[part2],
          partido3: partido[2],
          votos3: votes[part3],
          partido4: partido[3],
          votos4: votes[part4]
        },
        coalicion: {
          coalicion1: coalicion[0],
          votosCoal1: votes[coal1],
          coalicion2: coalicion[1],
          votosCoal2: votes[coal2],
          coalicion3: coalicion[2],
          votosCoal3: votes[coal3],
          coalicion4: coalicion[3],
          votosCoal4: votes[coal4],
          coalicion5: coalicion[4],
          votosCoal5: votes[coal5]
        }
      };

      console.log(jrvData);
    }
  });
};

// Calls the start of the function.
scrape();
