function makeMatrix(drugs) {
    var size = drugs.length
    console.table(drugs)
    var matrix = Array(size).fill(Array(size).fill(0))
    for (var i = 0, l = drugs.length; i < l; i++){
        // console.log(drugs[i].interactswith[0].interactswithLabel.value)
        const idek = drugs[i].interactswith
        
        if (idek.length == 0) {
        matrix.fill(Array(size).fill(0), i, i+1)
        } else {for (var j = 0, m = idek.length; j < m; j++){
                // console.log(drugs.map(x => x.medicationCode).indexOf(idek[j].interactswith.value.slice(31)))
                // console.log(drugs.map(x => x.medicationCode).indexOf(idek[j].interactswith.value.slice(31)))
                let index = drugs.map(x => x.medicationName).indexOf(idek[j].interactswithLabel.value )
                console.log(index)
                console.log(i)
                //row = Array(size).fill(0).fill(1, index, index + 1)
                matrix[i].splice(index, 1, 1)
                // matrix[index].splice(index, 1, 2)
                //matrix[index].splice(i, 1, 2)
                // matrix[index].splice(j, 1, 2)
            
            }
            
        }
    }
console.log(matrix)   
}
 