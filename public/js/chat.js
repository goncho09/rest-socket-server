const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnLogout = document.querySelector('button');

const url = window.location.hostname.includes('localhost') ?
    'http://localhost:4000/api/auth/' :
    'https://cursonode-socket-server.herokuapp.com/api/auth';

let usuario,
    socket = null;

const validarJWT = async() => {
    const token = localStorage.getItem('token');
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token },
    });
    const { usuario: usuarioDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = usuarioDB;
    document.title = usuario.nombre;
    await conectarSocket();
};

const conectarSocket = async() => {
    socket = io({
        extraHeaders: {
            'x-token': localStorage.getItem('token'),
        },
    });
    socket.on('connect', () => {
        console.log('Sockets online');
    });
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });
    socket.on('recibir-mensajes', mostrarMensajes);
    socket.on('usuarios-activos', mostrarUsuarios);
    socket.on('mensaje-privado', (payload) => {
        console.log(payload);
    });
};

const mostrarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;
};

const mostrarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
        <li>
            <p>
                <span class="text-primary">${nombre}: </span>
                <span>${mensaje}</span>
            </p>
        </li>
        `;
    });
    ulMensajes.innerHTML = mensajesHtml;
};

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const uid = txtUid.value;
    const mensaje = txtMensaje.value;
    if (keyCode !== 13) {
        return;
    }
    if (mensaje.length === 0) {
        return;
    }
    socket.emit('enviar-mensaje', { mensaje, uid });
    txtUid.value = '';
    txtMensaje.value = '';
});

const main = async() => {
    await validarJWT();
};

main();