export const normalizeObj = arr => {
    const obj = {};
    arr.forEach(el => obj[el.id] = el);
    return obj;
}
