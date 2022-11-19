function addChoice(form) {
    const output = form.inputbox.value
    const choice = output.slice(31);
    console.log(choice)
    alert("you chose " + choice);
}

// async function interactionQuery() {
//     const query = `SELECT DISTINCT ?medicine ?medicineLabel ?type ?typeLabel ?interactswithLabel ?treatsLabel 
//     WHERE {
//       {
//           VALUES ?item {wd:Q12140} #selects all entries that are medicines
//             ?medicine wdt:P279 ?item ; #?medicine is a subclass of those entries
//                  wdt:P2175 wd:Q181923 ; #which is selected only if the medical condition treated is Attention deficit Hyperactivity disorder
//                  wdt:P769 ?interactswith . #Significant drug interactions of that medicine
//             ?type wdt:P31 ?medicine . #Instances of that medication
//             ?interactswith wdt:P2175 ?treats . #? is the medical condition treated by the medicine that the drug interacts with 
//             ?treats wdt:P31 wd:Q12135 . #where ?treats is an instance of mental disorder
//       }
//       SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
//     }`
//     try {
//         const result = await runQuery(query)
//         console.log(result)
//     } catch (error) {
//         alert(error) // if the query can not be succesfully finished it gives an error in the browser.
//       }
// }