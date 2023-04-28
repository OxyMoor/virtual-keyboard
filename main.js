const getKeysInfo = async function() {
    const result = await fetch('./keys-info.json');

    if (!result.ok) {
        throw 'ERROR' + result.status;
    }

    return result.json();
}

const keysCount = 64;
const body = document.querySelector('body');
let language = 'en';

const titleText = 'RSS Virtual Keyboard';
const subtitleText = 'Oksana Moor, 2023';

const renderKeyboard = function(data) {
    const keyboardWrap = document.createElement('div');
    keyboardWrap.className = 'keyboard-wrap';

    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = titleText;

    const subtitle = document.createElement('h2');
    subtitle.className = 'subtitle';
    subtitle.textContent = subtitleText;

    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';

    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard';

    for (let i = 0; i < keysCount; i++) {
        let key = document.createElement('button');
        key.className = data[i]['class'];
        key.setAttribute('data-id', data[i]['data-id']);
        

        let ru = document.createElement('div');
        ru.className = 'ru hidden';

        let en = document.createElement('div');
        en.className = 'en'; 

        let textRu = document.createElement('span');
        textRu.className = 'text';
        textRu.textContent = data[i]['ru']['text'];
        let shiftTextRu = document.createElement('span');
        shiftTextRu.className = 'shift-text hidden'; 
        shiftTextRu.textContent = data[i]['ru']['text-shift'];
        let CapsTextRu = document.createElement('span');
        CapsTextRu.className = 'caps-text hidden'; 
        shiftTextRu.textContent = data[i]['ru']['text-caps'];

        let textEn = document.createElement('span');
        textEn.className = 'text'; 
        textEn.textContent = data[i]['en']['text'];
        let shiftTextEn = document.createElement('span');
        shiftTextEn.className = 'shift-text hidden'; 
        shiftTextEn.textContent = data[i]['en']['text-shift'];
        let CapsTextEn = document.createElement('span');
        CapsTextEn.className = 'caps-text hidden'; 
        shiftTextEn.textContent = data[i]['en']['text-caps'];

        ru.appendChild(textRu);
        ru.appendChild(shiftTextRu);
        ru.appendChild(CapsTextRu);

        en.appendChild(textEn);
        en.appendChild(shiftTextEn);
        en.appendChild(CapsTextEn);

        key.appendChild(ru);
        key.appendChild(en);

        keyboard.appendChild(key);
    }

    keyboardWrap.appendChild(title);
    keyboardWrap.appendChild(subtitle);
    keyboardWrap.appendChild(textarea);
    keyboardWrap.appendChild(keyboard);

    body.appendChild(keyboardWrap);
}

getKeysInfo().then(renderKeyboard);