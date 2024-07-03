export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export const contains = (selector, text) => {
    return [...document.querySelectorAll(selector)].filter(element => element.childNodes?.[0]?.nodeValue?.match(text))
}

export const printListWithLogo = (list) => {
    console.log(`%c
   _____                         __             _______ _____ _____    _____      _ _           _               
  / ____|                       / _|           |__   __/ ____/ ____|  / ____|    | | |         | |              
 | (___   __ _ _   _  ___ ___  | |_ ___  _ __     | | | |   | |  __  | |     ___ | | | ___  ___| |_ ___  _ __   
  \\___ \\ / _\` | | | |/ __/ _ \\ |  _/ _ \\| '__|    | | | |   | | |_ | | |    / _ \\| | |/ _ \\/ __| __/ _ \\| '__|  
  ____) | (_| | |_| | (_|  __/ | || (_) | |       | | | |___| |__| | | |___| (_) | | |  __/ (__| || (_) | |     
 |_____/ \\__,_|\\__,_|\\___\\___| |_| \\___/|_|       |_|  \\_____\\_____|  \\_____\\___/|_|_|\\___|\\___|\\__\\___/|_|     
                                                                                                                
%c${list.map(item => '  • ' + item.padEnd(107, ' ')).join("\n")}
${"".padEnd(112, ' ')}`,
        'color:#FA7035; background:#222;',
        'background:#222; font-weight: bold;'
    );
}