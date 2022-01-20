const uid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);
const ws = new WebSocket(`ws://${location.host}/ws/${uid}`);

ws.onopen = function() {
    console.info(`Connection established, UID: ${uid}`);
};

ws.onclose = function(e) {
    console.info('Connection closed!', e);
};

ws.onerror = function(e) {
    console.info('WebSocket Error: ', e);
};

var interval;

ws.onmessage = function(event) {
    data = JSON.parse(event.data);
    
    if (data.fn == 'start_game') {
        document.querySelector('#start-game').disabled = true;

        if (data.uid === uid)
            document.querySelector('#stop-game').disabled = false;
        else {
            draw();
            play();
        }
    } else if (data.fn == 'stop_game') {
        document.querySelector('#start-game').disabled = false;

        if (data.uid === uid)
            document.querySelector('#stop-game').disabled = true;
        else
            stop();
    } else if (data.fn == 'update_game')
        if (data.uid !== uid)
            game = data.game;
};

function start_game() {
    ws.send(JSON.stringify({fn: 'start_game', uid: uid}));
    interval = setInterval(update_game, 200);
}

function stop_game() {
    ws.send(JSON.stringify({fn: 'stop_game', uid: uid}));
    clearInterval(interval);
}

function update_game() {
    ws.send(JSON.stringify({fn: 'update_game', uid: uid, game: game}));
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#start-game').addEventListener('click', start_game);
    document.querySelector('#stop-game').addEventListener('click', stop_game);
});