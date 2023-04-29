const titleText = 'RSS Virtual Keyboard';
const subtitleText = 'Oksana Moor, 2023';
const infoOSText = 'The keyboard is created in the Windows OS';
const infoLangCombinationText = 'Language switch combination: left shift + alt';
const keysCount = 64;

const body = document.querySelector('body');
let language = 'en';

let cursorPosition = null;

const getKeysInfo = async function() {
    const result = await fetch('./keys-info.json');

    if (!result.ok) {
        throw 'ERROR' + result.status;
    }

    return result.json();
}

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

const renderKeyboard = function(data) {
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

        key.addEventListener('click', () => {
            enterDataToTextarea(event, data);
        });
    }

    const infoOS = document.createElement('p');
    infoOS.className = 'additional-info';
    infoOS.textContent = infoOSText;

    const infoLangCombination = document.createElement('p');
    infoLangCombination.className = 'additional-info';
    infoLangCombination.textContent = infoLangCombinationText;

    keyboardWrap.appendChild(title);
    keyboardWrap.appendChild(subtitle);
    keyboardWrap.appendChild(textarea);
    keyboardWrap.appendChild(keyboard);
    keyboardWrap.appendChild(infoOS);
    keyboardWrap.appendChild(infoLangCombination);

    body.appendChild(keyboardWrap);
}

getKeysInfo().then(renderKeyboard);

const enterDataToTextarea = (event, info) => {
    if (info[event.currentTarget.dataset.id]['keyCode'] === '8') { // backspace
        let string = textarea.value;

        if (cursorPosition > 0) {
            textarea.value = string.slice(0, cursorPosition - 1) + string.slice(cursorPosition);
            cursorPosition--;
        }
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '46') { // del
        let string = textarea.value;

        if (cursorPosition < string.length) {
            textarea.value = string.slice(0, cursorPosition) + string.slice(cursorPosition + 1);
        }
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '9') { // tab
        textarea.value += '\t';
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '13') { // enter
        textarea.value += '\n';
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '20') { // caps
        textarea.value += '';
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '16') { // shift
        textarea.value += '';
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '17') { // ctrl
        textarea.value += '';
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '18') { // alt
        textarea.value += '';
    } else if (info[event.currentTarget.dataset.id]['keyCode'] === '91') { // win
        textarea.value += '';
    }
    else {
        let string = textarea.value;
        let textToEnter = info[event.currentTarget.dataset.id][language]['text']; // letters and digits

        textarea.value = string.slice(0, cursorPosition) + textToEnter + string.slice(cursorPosition);
        cursorPosition++;
    }
}

const getCursorPosition = function(input){
    if (document.selection){
        let range = document.selection.createRange();
        range.moveStart('textedit', -1);
        cursorPosition = range.text.length;
    } else {
        cursorPosition = input.selectionStart;
    }

    return cursorPosition;
}

textarea.addEventListener('click', () => {
    console.log('click');
    getCursorPosition(textarea);
});
textarea.addEventListener('keyup', () => {
    console.log('keyup');
    console.log(textarea.value);
    getCursorPosition(textarea);
});
textarea.addEventListener('change', () => {
    console.log('change');
    getCursorPosition(textarea);
});

textarea.addEventListener('input', () => {
    console.log('input');
    getCursorPosition(textarea);
});