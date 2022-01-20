const uid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);
const ws = new WebSocket(`ws://${location.host}/ws/${uid}`);

ws.onopen = function() {
    console.info(`Connection established, UID: ${uid}`);
    ws.send(JSON.stringify({fn: 'login', uid: uid}));
};

ws.onclose = function(e) {
    console.info('Connection closed!', e);
};

ws.onerror = function(e) {
    console.info('WebSocket Error: ', e);
};

var interval;
var btn_start = document.querySelector('#start-game');
var btn_stop = document.querySelector('#stop-game');

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    if (data.fn == 'login' && data.puid !== '') {
        btn_start.disabled = true;
        anim = requestAnimationFrame(play);
    } else if (data.fn == 'logout' && data.uid == data.puid) {
        stop();
        btn_start.disabled = false;
        alert('The player has quit the game!');
    } else if (data.fn == 'start_game') {
        btn_start.disabled = true;

        if (data.uid === uid)
            btn_stop.disabled = false;
        else
            anim = requestAnimationFrame(play);
    } else if (data.fn == 'stop_game') {
        btn_start.disabled = false;
        stop();

        if (data.uid === uid)
            btn_stop.disabled = true;
        else
            alert('The player has stopped the game!');
    } else if (data.fn == 'update_game' && data.uid !== uid)
        game = data.game;
};

function start_game() {
    ws.send(JSON.stringify({fn: 'start_game', uid: uid}));
    interval = setInterval(update_game, 100);
    canvas.addEventListener('mousemove', playerMove);
}

function stop_game() {
    ws.send(JSON.stringify({fn: 'stop_game', uid: uid}));
    clearInterval(interval);
    canvas.removeEventListener('mousemove', playerMove);
}

function update_game() {
    ws.send(JSON.stringify({fn: 'update_game', uid: uid, game: game}));
}

document.addEventListener('DOMContentLoaded', function () {
    btn_start.addEventListener('click', start_game);
    btn_stop.addEventListener('click', stop_game);
    draw();
});

document.addEventListener('DOMContentLoaded', function () {
    canvas.removeEventListener('mousemove', playerMove);
});