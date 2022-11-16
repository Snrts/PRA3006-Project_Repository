class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }

  query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };

      return fetch( fullUrl, { headers } ).then( body => body.json() );
  }
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `SELECT DISTINCT ?treatmentLabel ?treatingLabel
WHERE{ 
VALUES ?disease {wd:Q12135} #tells query to look at the entries which are inside of Q12135
?type wdt:P279 ?disease ; #gives all the types
      wdt:P2176 ?treatment .
?treatment wdt:P2175 ?treating .
#   ?kind wdt:P279 ?treating .
#   ?dis wdt:P279 ?kind .
SERVICE wikibase:label {bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en"}
}
`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
const query = queryDispatcher.query(sparqlQuery).then(console.log)