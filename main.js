const titleText = 'RSS Virtual Keyboard';
const subtitleText = 'Oksana Moor, 2023';
const infoOSText = 'The keyboard is created in the Windows OS';
const infoLangCombinationText = 'Language switch combination: left shift + alt';
const keysCount = 64;

const body = document.querySelector('body');
let language = 'en';

let cursorPosition = null;

let isCaps = false;

const getKeysInfo = async function() {
    const result = await fetch('./keys-info.json');

    if (!result.ok) {
        throw 'ERROR' + result.status;
    }

    return result.json();
};

function setLocalStorage() {
    localStorage.setItem('lang', language);
}

function getLocalStorage() {
    if (localStorage.getItem('lang')) {
        language = localStorage.getItem('lang');
    } 
}

getLocalStorage();

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

let keys = [];

for (let i = 0; i < keysCount; i++) {
    let key = document.createElement('button');

    let ru = document.createElement('div');
    ru.className = 'ru';

    let en = document.createElement('div');
    en.className = 'en'; 

    let textRu = document.createElement('span');
    textRu.className = 'text';

    let shiftTextRu = document.createElement('span');
    shiftTextRu.className = 'shift-text hidden'; 

    let CapsTextRu = document.createElement('span');
    CapsTextRu.className = 'caps-text hidden'; 

    let textEn = document.createElement('span');
    textEn.className = 'text'; 

    let shiftTextEn = document.createElement('span');
    shiftTextEn.className = 'shift-text hidden'; 

    let CapsTextEn = document.createElement('span');
    CapsTextEn.className = 'caps-text hidden'; 

    ru.appendChild(textRu);
    ru.appendChild(shiftTextRu);
    ru.appendChild(CapsTextRu);
    
    en.appendChild(textEn);
    en.appendChild(shiftTextEn);
    en.appendChild(CapsTextEn);

    key.appendChild(ru);
    key.appendChild(en);

    keyboard.appendChild(key);

    keys.push(key);
}

const infoOS = document.createElement('p');
const infoLangCombination = document.createElement('p');

keyboardWrap.appendChild(title);
keyboardWrap.appendChild(subtitle);
keyboardWrap.appendChild(textarea);
keyboardWrap.appendChild(keyboard);
keyboardWrap.appendChild(infoOS);
keyboardWrap.appendChild(infoLangCombination);

body.appendChild(keyboardWrap);

const toggleCapsText = function(arr) {
    arr.forEach(el => {
        let capsText = el.querySelector('.' + language).querySelector('.caps-text');
        capsText.classList.toggle('hidden');

        let text = el.querySelector('.' + language).querySelector('.text');
        text.classList.toggle('hidden');
    });

    isCaps = !isCaps;
}

const renderKeyboard = function(data) {
    keys.forEach((key, i, array) => {
        key.className = data[i]['class'];
        key.setAttribute('data-id', data[i]['data-id']);
        key.setAttribute('data-keyCode', data[i]['keyCode']);
        
        if (language === 'en') {
            key.querySelector('.ru').classList.add('hidden');
            key.querySelector('.en').classList.remove('hidden');
        } else if (language === 'ru') {
            key.querySelector('.en').classList.add('hidden');
            key.querySelector('.ru').classList.remove('hidden');
        }

        key.querySelector('.ru').querySelector('.text').textContent = data[i]['ru']['text'];
        key.querySelector('.ru').querySelector('.shift-text').textContent = data[i]['ru']['text-shift'];
        key.querySelector('.ru').querySelector('.caps-text').textContent = data[i]['ru']['text-caps'];

        key.querySelector('.en').querySelector('.text').textContent = data[i]['en']['text'];
        key.querySelector('.en').querySelector('.shift-text').textContent = data[i]['en']['text-shift'];
        key.querySelector('.en').querySelector('.caps-text').textContent = data[i]['en']['text-caps'];

        key.addEventListener('click', () => {
            enterDataToTextarea(event, data);
        });
        key.addEventListener('mousedown', () => {
            if (key.dataset.keycode === '20') {
                key.classList.toggle('pressed');

                toggleCapsText(keys);
            } else {
                key.classList.add('pressed');
            }
        });
        key.addEventListener('mouseup', () => {
            if (key.dataset.keycode !== '20') {
                key.classList.remove('pressed');
            }
        });
    });

    infoOS.className = 'additional-info';
    infoOS.textContent = infoOSText;

    infoLangCombination.className = 'additional-info';
    infoLangCombination.textContent = infoLangCombinationText;
};

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
        let string = textarea.value;

        textarea.value = string.slice(0, cursorPosition) + '\t' + string.slice(cursorPosition);
        cursorPosition++;
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
        // let keyText;
        // if (!isCaps) {
        //     keyText = 'text';
        // } else {
        //     keyText = 'text-caps';
        // }

        let string = textarea.value;
        let textToEnter = info[event.currentTarget.dataset.id][language]['text']; // letters and digits

        textarea.value = string.slice(0, cursorPosition) + textToEnter + string.slice(cursorPosition);
        cursorPosition++;
    }
};

const getCursorPosition = function(input){
    if (document.selection) {
        let range = document.selection.createRange();
        range.moveStart('textedit', -1);
        cursorPosition = range.text.length;
    } else {
        cursorPosition = input.selectionStart;
    }

    return cursorPosition;
};

textarea.addEventListener('click', () => {
    getCursorPosition(textarea);
});
textarea.addEventListener('keyup', () => {
    getCursorPosition(textarea);
});
textarea.addEventListener('change', () => {
    getCursorPosition(textarea);
});
textarea.addEventListener('input', () => {
    getCursorPosition(textarea);
});

const getPressedKey = function(kc, c) {
    if ((kc === 16 || kc === 17 || kc === 18) && c.includes('Left')) {
        return document.querySelectorAll('[data-keyCode="' + kc + '"]')[0];
    } else if ((kc === 16 || kc === 17 || kc === 18) && c.includes('Right')) {
        return document.querySelectorAll('[data-keyCode="' + kc + '"]')[1];
    } else {
        return document.querySelector('[data-keyCode="' + kc + '"]');
    }
};

document.addEventListener('keydown', (event) => {
    let keyCode = event.keyCode;
    let code = event.code;

    if (keyCode === 9) {
        event.preventDefault();

        let string = textarea.value;

        textarea.value = string.slice(0, cursorPosition) + '\t' + string.slice(cursorPosition);
        cursorPosition++;
    } else if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
        event.preventDefault();
        
        let string = textarea.value;
        let pressedKeyText;
        getKeysInfo().then(data=> {
            pressedKeyText = data[getPressedKey(keyCode, code).dataset.id][language]['text'];
            
            textarea.value = string.slice(0, cursorPosition) + pressedKeyText + string.slice(cursorPosition);
        });
    } else if (keyCode === 91 || keyCode === 17 || keyCode === 18) {
        event.preventDefault();
    } 
    
    let pressedKey = getPressedKey(keyCode, code);

    if (pressedKey.dataset.keycode === '20') {
        pressedKey.classList.toggle('pressed');

        toggleCapsText(keys);
    } else {
        pressedKey.classList.add('pressed');
    } 

    if (keyCode !== 16 && keyCode !== 17 && keyCode !== 18 && keyCode !== 20 && keyCode !== 91) {
        textarea.focus();
    }
});

document.addEventListener('keyup', (event) => {
    let keyCode = event.keyCode;
    let code = event.code;
    
    let pressedKey = getPressedKey(keyCode, code);

    if (pressedKey.dataset.keycode !== '20') {
        pressedKey.classList.remove('pressed');
    }
});

const pressTwoKeys = function(f, ...codes) {
    let pressed = new Set();
    document.addEventListener('keydown', function(event) {
        pressed.add(event.keyCode);
        
        for (let code of codes) {
            if (!pressed.has(code)) {
                return;
            }
        }
        
        pressed.clear();
        
        f();
    });
    document.addEventListener('keyup', function(event) {
        pressed.delete(event.keyCode);
    });
};

const changeLanguage = function() {
    if (language === 'en') {
        language = 'ru';
    } else if (language === 'ru') {
        language = 'en';
    }
    
    setLocalStorage();
    getKeysInfo().then(renderKeyboard);
};

pressTwoKeys(changeLanguage, 16, 18);