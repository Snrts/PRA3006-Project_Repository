class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }
  query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetch( fullUrl , { headers } ).then( body => body.json());
  }
}
// Setting up an endpoint to the wikidata database 
//_________________________________________________________________________________________________________________//
async function runQuery(query) {
  const endpointUrl = 'https://query.wikidata.org/sparql';
  let queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  let response = await queryDispatcher.query(query);
  // console.table(response)
  return response
}
// Defines a function into which we can input and run a query
//_________________________________________________________________________________________________________________//
async function diseasesQuery() { // asynchronous function to fetch diseases
  const query = `SELECT DISTINCT ?disease ?diseaseLabel
  WHERE {
    {
      VALUES ?item {wd:Q112193867} #all entries of "mental disorder
            ?disease wdt:P31 ?item ; # the variable disease is seen as an instance of mental disorder
                     wdt:P1995 wd:Q7867 ; # which is falls under psychiatry 
                     wdt:P2176 ?treatment . # and has any treatment 
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
  }` // Defines query
  try { //if the query is succesfull the following will run
    const result = await runQuery(query); //runs the function "runQuery()" with the previous query as input, then waits for that to be finished
    const diseases = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
    return diseases
  } catch (error) {
    alert(error) // if the query can not be succesfully finished it gives an error in the browser.
  }
}

//_________________________________________________________________________________________________________________________________________//
async function medicationQuery(input) {
  const template = `SELECT DISTINCT ?medicine ?medicineLabel  
  WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
    {
        VALUES ?item {wd:DISEASE} # select all items connected to "variable 
        ?item wdt:P2176 ?medicine;
  }
}`
const querymeds = template.replace('DISEASE', input) //we replace the string "variable" in the query by the code of the disease, stored in "input"
try { //if the query is succesfull the following will run
  const result = await runQuery(querymeds) // first waits for the result to be fetched, otherwise we will not catch the promise
  const medication = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
  return medication //we need this so that when we run the function elsewhere we can store the results
} catch (error) {
    alert(error) // if the query can not be succesfully finished it gives an error in the browser.
  }
}
//________________________________________________________________________________________________________________________________________//

async function interactionsQuery(medicine, disease) {
  const querytemplate = `SELECT DISTINCT  ?interactswith ?interactswithLabel
  WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
    {
        wd:MED wdt:P769 ?interactswith . #the medications that interact with the input medicine
      } UNION {
       ?interactswith wdt:P769 wd:MED . #the medications that the input medicine interacts with 
      }
      ?interactswith wdt:P2175 ?treats .
      ?treats wdt:P31 wd:Q112193867 ; 
                  wdt:P1995 wd:Q7867 .
      FILTER(?treats = wd:DISEASES ) # filters the results such that we only get the interactions with a given medication if it treats one of 
                                  # the selected diseases
  }`
  const queryint = querytemplate.replaceAll("MED", medicine).replace("DISEASES", disease)
  try { //if the query is succesfull the following will run
    const result = await runQuery(queryint)
    const medication = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
    return medication
  } catch (error) {
      alert(error) // if the query can not be succesfully finished it gives an error in the browser.
    }
}
async function interactionsQuery2(medicine, disease) {
  const querytemplate = `SELECT DISTINCT ?medicine ?medicineLabel  (group_concat(?interactswith;separator=", ") as ?interactions) (group_concat(?interactswithLabel;separator=", ") as ?interactionsLabel)
  WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". 
                           ?interactswith rdfs:label ?interactswithLabel.
                           ?medicine rdfs:label ?medicineLabel .}
    VALUES ?item {wd:DISEASEA} # select all items connected to "variable 
        ?item wdt:P2176 ?medicine  
    {
        ?medicine wdt:P769 ?interactswith . #the medications that interact with the input medicine
      } UNION {
       ?interactswith wdt:P769 ?medicine . #the medications that the input medicine interacts with 
      }
      ?interactswith wdt:P2175 ?treats .
      ?treats wdt:P31 wd:Q112193867 ; 
                  wdt:P1995 wd:Q7867 .
       FILTER(INTERACTIONS) # filters the results such that we only get the interactions with a given medication if it treats one of 
                                  # the selected diseases

  }  
GROUP BY ?medicine ?medicineLabel`
  const queryint = querytemplate.replaceAll("DISEASEA", medicine).replace("INTERACTIONS", disease)
  try { //if the query is succesfull the following will run
    const result = await runQuery(queryint)
    const medication = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
    return medication
  } catch (error) {
      alert(error) // if the query can not be succesfully finished it gives an error in the browser.
    }
}
//_________________________________________________________________________________________________________________//
