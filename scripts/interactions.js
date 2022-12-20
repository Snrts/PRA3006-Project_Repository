/*______________________________________________________________________________________________________________________________________________*/
async function fetchInteractions(selected) {
    const medsAllInclInteractions = []
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
    for (let i = 0; i < selected.length; i++) {                   // loops through each possible combination of the selected diseases
            var filter = ""                                       //  and constructs a string for each which is later passed on to the 
            for (let j = 0; j < selected.length; j++) {           // query function to be used as a filter 
                    if (filter.length < 1) {
                       filter += "?treats = wd:" + selected[j][0] // we only want an "or" statement if the user has chosen more than
                    } else {                                      // 1 disease or if it is not the first iteration, otherwise the query 
                        filter += " || ?treats = wd:" + selected[j][0] // will not run as expected
                    }                                             // since we later check for overlap between medications we include the
            }                                                     // interactions of some medication with others that treat the same disease////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
            const interactions = await interactionsQuery(selected[i][0], filter) // we pass on each selected disease along with the filter 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           
        for (let k = 0; k < interactions.length; k++){
             // in the query we have grouped all interactions that belong to some medication, the output is therefore concatenated, 
             // here we ensure that the data is in the form that we need it to be
                const meds = (interactions.map(x => x.interactions.value)[k].split(",")).map(x => x.slice(31))
                const name = interactions.map(x => x.interactionsLabel.value)[k].split(",")
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // we now create an object of all the data we have retrieved, if there is some overlap between medications we alter the already
            // existing entry to form a combined group
            if (!(medsAllInclInteractions.map(x => x.medicationName)).includes(interactions[k].medicineLabel.value)) {
                    medsAllInclInteractions.push(
                        {
                            diseaseName: (selected[i][1]),
                            diseaseCode: (selected[i][0]),
                            medicationName: interactions[k].medicineLabel.value,
                            medicationCode: interactions[k].medicine.value.slice(31),
                            interactswithName: name,
                            interactswithCode: meds
                        })
                } else {
                    const l = (medsAllInclInteractions.map(x=>x.medicationName)).indexOf(interactions[k].medicineLabel.value)
                    medsAllInclInteractions[l].diseaseName += " & "+(selected[i][1])
                    medsAllInclInteractions[l].diseaseCode += " & "+(selected[i][0])
                }}}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //to ensure that the overlapping groups are positioned between the groups that overlap, we
    //sort the list of objects before passing it on to the makeMatrix function by comparing the 
    //values of all entries and changing the indices
    const list = medsAllInclInteractions.sort((a, b) => {
        if (a.diseaseName < b.diseaseName) {
            return -1;
        }
        if (a.diseaseName > b.diseaseName) {
            return 1;
        }
        return 0;
    })
    makeMatrix(list)
}
/*______________________________________________________________________________________________________________________________________________*/
function makeMatrix(allMedswInteractions) { 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // we need the data to be in an n x n matrix, where n is the number of medications, so the size should be equal to the length 
    // of the array containing all medications 
    const size = allMedswInteractions.length
    const matrix = []
    // if there is an interaction between medications the entry corresponding to both should be 1 instead of 0
    // so for each medication we create an n dimensional Array, fill it with zeroes, then find the indices of the interactions and 
    // replace the entries in that column by one, after that we add that row to the "matrix" array
    allMedswInteractions.forEach((med) => {
        let row = Array(size).fill(0)
        for (var i = 0, l = med.interactswithCode.length; i < l; i++){
                let index = allMedswInteractions.map(x => x.medicationName).indexOf((med.interactswithName[i]))
                row.splice(index, 1, 1)
        }
        matrix.push(row)
    }
        )
    dataVisualization(allMedswInteractions, matrix)
}
/*______________________________________________________________________________________________________________________________________________*/
