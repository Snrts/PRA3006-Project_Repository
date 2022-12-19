async function fetchInteractions(selected) {
    const medsAllInclInteractions = []
        for (let i = 0; i < selected.length; i++) {
            var query = ""
            for (let j = 0; j < selected.length; j++) {
                // if (i !== j) {
                    if (query.length < 1) {
                       query += "?treats = wd:" + selected[j][0][0] 
                    } else {
                        query += " || ?treats = wd:" + selected[j][0][0]
                    }
                // }
            
            }
            const interactions = await interactionsQuery2(selected[i][0][0], query) 
            console.log(interactions)
            
            for (let k = 0; k < interactions.length; k++){
                const meds = (interactions.map(x => x.interactions.value)[k].split(",")).map(x => x.slice(31))
                const name = interactions.map(x => x.interactionsLabel.value)[k].split(",")
                // console.log(meds, name)
                if (!(medsAllInclInteractions.map(x=>x.medicationName)).includes(interactions[k].medicineLabel.value)) {
                    medsAllInclInteractions.push(
                        {
                            diseaseName: (selected[i][0])[1],
                            diseaseCode: (selected[i][0])[0],
                            medicationName: interactions[k].medicineLabel.value,
                            medicationCode: interactions[k].medicine.value.slice(31),
                            interactswithName: name,
                            interactswithCode: meds
                        })
                } else {
                    const l = (medsAllInclInteractions.map(x=>x.medicationName)).indexOf(interactions[k].medicineLabel.value)
                    medsAllInclInteractions[l].diseaseName += " & "+(selected[i][0])[1]
                    medsAllInclInteractions[l].diseaseCode += " & "+(selected[i][0])[0]
                }
            }
            
            // console.log(interactions.map(x => x))
            // 
            
            
    }
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
        
   


function makeMatrix(allMeds) { 
    const size = allMeds.length
    const matrix = []
    
    allMeds.forEach((med) => {
        let row = Array(size).fill(0)
        for (var i = 0, l = med.interactswithCode.length; i < l; i++){
                let index = allMeds.map(x => x.medicationName).indexOf((med.interactswithName[i]))
                row.splice(index, 1, 1)
        }
        matrix.push(row)
    }
        )
    console.log(matrix)
    dataVisualization(allMeds, matrix)
}

