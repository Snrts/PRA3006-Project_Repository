function overlap(title, x, y) { //the title is the relevat diseases and should be used to label the overlap
    let intersection = [title, x.filter(el => y.includes(el))] // assigns an array that containd the names of the diseases 
    //of which the drugs overlap and a list that contains the codes of those drugs
    console.log(intersection)
}

async function interact(selection) {
    for (var a = 0, b = selection.length; a < b; a++) {
        for (var c = 0, d = selection[a].length; c < d; c++) {
            for (var e = 0, f = selection.length; e < f && e != a; e++) {
               const fi = selection[a][c].interactswith
                let filtered = fi.filter(
                function(el) {
                    return selection[e].some(med => med.medcode == el) = true
                })
                console.log(filtered)
            }
            // console.log(Object.entries(selection))
        }
    }
}
    // switch (selection.length) {
    //     case 3:
    //         console.log("in progress")
    //         break;
    //     case 2:
    //         console.table("intraction of " + selection[0].label + "with " + selection[1].label)
    //         await fetchInteractions(selection[0].value.slice(31), selection[1].value.slice(31))
    //         console.table("intraction of " + selection[1].label + "with " + selection[0].label)
    //         await fetchInteractions(selection[1].value.slice(31), selection[0].value.slice(31))
    //         break
    //     case 1:
    //         console.log("in progress")
    //         break;
    //     default:
    //         alert("you can currently only select 3")
    //         break;
    // }
