class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }
  query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetch( fullUrl , { headers } ).then( body => body.json() );
  }
}
const endpointUrl = 'https://query.wikidata.org/sparql';
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
// Setting up an endpoint to the wikidata database 
//_________________________________________________________________________________________________________________//
async function runQuery(query) {
  const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  let response = await queryDispatcher.query(query);
  // var data = await response.json();
  console.log(response)
  return response
}
// Defines a function into which we can input and run a query
//_________________________________________________________________________________________________________________//
async function diseasesQuery() { //asynchronous function to fetch diseases
  const query = `SELECT DISTINCT ?diseaseLabel WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
    {
      SELECT DISTINCT ?disease 
      WHERE {
        ?disease p:P31 ?statement0.
        ?statement0 (ps:P31/(wdt:P279*)) wd:Q12135.
      }
    }
  }` // Defines query
  try {
    const ill = await runQuery(query); //runs the function "runQuery()" with the previous query as input, then waits for that to be finished
    const disease = Object.entries(ill)
    console.log(disease)
    return disease
  } catch (error) {
    alert(error) // if the query can not be succesfully finished it gives an error in the browser.
  }
}
// Query to fetch the mental diseases from the SPARQL endpoint of wikidata
//_________________________________________________________________________________________________________________//
// const treatmentQuery = `SELECT DISTINCT ?treatmentLabel ?treatingLabel
// WHERE{ 
// VALUES ?disease {wd:Q12135} #tells query to look at the entries which are inside of Q12135
// ?type wdt:P279 ?disease ; #gives all the types
//       wdt:P2176 ?treatment .
// ?treatment wdt:P2175 ?treating .
// #   ?kind wdt:P279 ?treating .
// #   ?dis wdt:P279 ?kind .
// SERVICE wikibase:label {bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en"}
// }
// `;


