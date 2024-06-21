const keyMappingsLocal = {
    ArrowLeft: {
        press: (arena) => {
            const playerIndex = arena.gameType == "2v2" ? 2 : 1;
            arena.movePlayer(playerIndex, 'moveRight', true);
        },
        release: (arena) => {
            const playerIndex = arena.gameType == "2v2" ? 2 : 1;
            arena.movePlayer(playerIndex, 'moveRight', false);
        }
    },
    ArrowRight: {
        press: (arena) => { 
            const playerIndex = arena.gameType == "2v2" ? 2 : 1;
            arena.movePlayer(playerIndex, 'moveLeft', true);
        },
        release: (arena) => {
            const playerIndex = arena.gameType == "2v2" ? 2 : 1;
            arena.movePlayer(playerIndex, 'moveLeft', false);
        }
    },
    a: {
        press: (arena) => { arena.movePlayer(0, 'moveLeft', true); },
        release: (arena) => { arena.movePlayer(0, 'moveLeft', false); }
    },
    d: {
        press: (arena) => { arena.movePlayer(0, 'moveRight', true); },
        release: (arena) => { arena.movePlayer(0, 'moveRight', false); }
    },
    c: {
        press: (arena) => { arena.changeCamera(); }
    },
    '1': {
        press: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(3, 'moveLeft', true); },
        release: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(3, 'moveLeft', false); }
    },
    '3': {
        press: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(3, 'moveRight', true); },
        release: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(3, 'moveRight', false); }
    },
    l: {
        press: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(1, 'moveRight', true); },
        release: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(1, 'moveRight', false); }
    },
    j: {
        press: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(1, 'moveLeft', true); },
        release: (arena) => { if (arena.gameType == "2v2") arena.movePlayer(1, 'moveLeft', false); }
    }
};

export default keyMappingsLocal;
