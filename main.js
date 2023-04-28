const getKeysInfo = async function() {
    const result = await fetch('./keys-info.json');

    if (!result.ok) {
        throw 'ERROR' + result.status;
    }

    return result.json();
}

getKeysInfo().then(data => console.log(data))