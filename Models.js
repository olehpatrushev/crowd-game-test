var dataJson = {
    mPlate: null,
    mMan: null
};

(async function () {
    let mMan = await fetch('models/man.gltf');
    dataJson.mMan = await mMan.text();
    let mPlate = await fetch('models/plate.gltf');
    dataJson.mPlate = await mPlate.text();
})();