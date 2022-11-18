import { getWikidataSparql } from "@entitree/helper";
const query = `SELECT DISTINCT ?diseaseLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
  {
    SELECT DISTINCT ?disease 
    WHERE {
      ?disease p:P31 ?statement0.
      ?statement0 (ps:P31/(wdt:P279*)) wd:Q12135.
    }
  }
}`

results = await getWikidataSparql(query)
console.log(results)