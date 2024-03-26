const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { return images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../Images', false, /\.(png|jpe?g|svg|gif)$/));

export default images;