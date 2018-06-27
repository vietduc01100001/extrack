exports.isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

exports.toString = (obj) => {
    let str = '';
    Object.values(obj).forEach(val => str += `${val} `);
    return str;
};