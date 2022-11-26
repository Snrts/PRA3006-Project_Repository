function overlap(title, x, y) { //the title is the relevat diseases and should be used to label the overlap
    let intersection = [title, x.filter(el => y.includes(el))] // assigns an array that containd the names of the diseases 
    //of which the drugs overlap and a list that contains the codes of those drugs
    console.log(intersection)
}

async function fetchInteractions(selected) {
    //         for (var i = 0; i < 3; i++) {
    //         for (var j = 0; j < 3 && i != j; j++){
    //             const disease = ((selected[i])[0])[0]
    //             const meds = ((selected[j])[0])[2]
    //             const int = []
    //             for (var k = 0, l = meds.length; k < l; k++){
    //                 const interactions = await interactionsQuery((meds[k])[0], disease)
        
    //                 int.push(
    //                     {
    //                         diseaseName: ((selected[j])[0])[1],
    //                         diseaseCode: ((selected[j])[0])[0],
    //                         medicationName: (meds[k])[1], 
    //                         medicationCode: (meds[k])[0],
    //                         interactswith: interactions
    //                     })
                    
    //             }
                
            
    //         col3.push(int)};
    // }
    // console.log(col3)
    // // write what the thingy should be replaced by if theres only 2 options 
    // //  eg replaceAll("DISEASE", code)
        // case 2: 
            const disA = (selected[0][0])[0]
            const medsA = (selected[0][0])[2]
            const disB = (selected[1][0])[0]
            const medsB = (selected[1][0])[2]
            const medsAll = []
            for (var i = 0, l = medsA.length; i < l; i++){
                const interactions = await interactionsQuery((medsA[i])[0], disB)
                medsAll.push(
                    {
                        diseaseName: (selected[0][0])[1],
                        diseaseCode: disA,
                        medicationName: (medsA[i])[1], 
                        medicationCode: (medsA[i])[0],
                        interactswith: interactions
                    })
            }
            for (var j = 0, m = medsB.length; j < m; j++){
                const interactions = await interactionsQuery((medsB[j])[0], disA)
                medsAll.push(
                    {
                        diseaseName: (selected[1][0])[1],
                        diseaseCode: disB,
                        medicationName: (medsB[j])[1], 
                        medicationCode: (medsB[j])[0],
                        interactswith: interactions
                    })
            }
            makeMatrix(medsAll)
            // break;
    //     case 1: alert("no interactions")
    //         break;
    //     default: alert("currently we can only check for up to 3 diseases at a time");
    //         break;
    // }
}

