function checkInteraction(meds) {
    var arrA = meds[0][1]
    var arrB = meds[1][1]
    let intersection = arrA.filter(x => arrB.includes(x))
    console.log(intersection)
}