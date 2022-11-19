function overlap(title, x, y) { //the title is the relevat diseases and should be used to label the overlap
    let intersection = [title, x.filter(el => y.includes(el))] // assigns an array that containd the names of the diseases 
    //of which the drugs overlap and a list that contains the codes of those drugs
    console.log(intersection)
}

