const keyMappingsOnline = {
    ArrowLeft: {
        press: (arena, index) => { arena.movePlayer(index, 'moveRight', true); },
        release: (arena, index) => { arena.movePlayer(index, 'moveRight', false); }
    },
    ArrowRight: {
        press: (arena, index) => { arena.movePlayer(index, 'moveLeft', true); },
        release: (arena, index) => { arena.movePlayer(index, 'moveLeft', false); }
    },
    a: {
        press: (arena, index) => { arena.movePlayer(index, 'moveLeft', true); },
        release: (arena, index) => { arena.movePlayer(index, 'moveLeft', false); }
    },
    d: {
        press: (arena, index) => { arena.movePlayer(index, 'moveRight', true); },
        release: (arena, index) => { arena.movePlayer(index, 'moveRight', false); }
    },
    c: {
        press: (arena) => { arena.changeCamera(); }
    }
};

export default keyMappingsOnline;
