const getKeysInfo = async function() {
    const result = await fetch('./keys-info.json');

    if (!result.ok) {
        throw 'ERROR' + result.status;
    }

    return result.json();
}

const body = document.querySelector('body');

const renderKeyboard = function(data) {
    const keyboardWrap = document.createElement('div');
    keyboardWrap.classList.add('keyboard-wrap');

    const title = document.createElement('h1');
    title.classList.add('title');

    const subtitle = document.createElement('h2');
    subtitle.classList.add('subtitle');

    const textarea = document.createElement('textarea');
    textarea.classList.add('textarea');
}

getKeysInfo().then(data => console.log(data))