const form = document.querySelector('form');
const url = window.location.hostname.includes('localhost') ?
    'http://localhost:4000/api/auth/' :
    'https://cursonode-socket-server.herokuapp.com/api/auth';

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = {};
    for (let el of form.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }
    fetch(url + 'login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log);
});

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    const data = {
        id_token,
    };

    fetch(url + 'google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((resp) => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log);
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}