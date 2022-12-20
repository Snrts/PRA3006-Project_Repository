async function fetchInteractions(selected) {
    console.log(selected)
        const disA = (selected[0][0])[0]
        const medsA = (selected[0][0])[2]
        const disB = (selected[1][0])[0]
        const medsB = (selected[1][0])[2]
    const medsAllInclInteractions = []
    
    for (var i = 0, l = medsA.length; i < l; i++)
    {
        const interactions = await interactionsQuery((medsA[i])[0], disB)
        medsAllInclInteractions.push(
            {
                diseaseName: (selected[0][0])[1],
                diseaseCode: disA,
                medicationName: (medsA[i])[1], 
                medicationCode: (medsA[i])[0],
                interactswith: interactions
            })
    }

    for (var j = 0, m = medsB.length; j < m; j++)
    {
        const interactions = await interactionsQuery((medsB[j])[0], disA)
        medsAllInclInteractions.push(
            {
                diseaseName: (selected[1][0])[1],
                diseaseCode: disB,
                medicationName: (medsB[j])[1], 
                medicationCode: (medsB[j])[0],
                interactswith: interactions
            })
    }
    console.table(medsAllInclInteractions)
    makeMatrix(medsAllInclInteractions)

}

function makeMatrix(allMeds) {
    let filtered = allMeds.filter(med => med.interactswith.map(x => x.interactswithLabel.value).length>0)
    if (filtered.length == 0) {
        alert("No interactions")
    }
 
    const size = filtered.length
    const matrix = []
    filtered.forEach((med) => {
        let row = Array(size).fill(0)
        for (var i = 0, l = med.interactswith.length; i < l; i++){
                let index = filtered.map(x => x.medicationName).indexOf((med.interactswith[i].interactswithLabel.value))
                row.splice(index, 1, 1)
        }
        matrix.push(row)
    }
        )
console.log(filtered)
    dataVisualization(filtered, matrix)
}

