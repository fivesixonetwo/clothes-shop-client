export const groupBy = (arr, criteria, inner) => {
    if (!arr) return null;
    return arr.reduce(function (acc, currentValue) {
        if (!acc[currentValue[criteria]]) {
            acc[currentValue[criteria]] = [];
        }
        acc[currentValue[criteria]].push(inner ? currentValue[inner] : currentValue);
        return acc;
    }, {});
}

export const getReadableSpecifications = (specs) => {
    let groups = groupBy(specs, "name", "value");
    return Object.keys(groups).map(function (key) {
        return {key, values: groups[key].join(", ")};
    });
}