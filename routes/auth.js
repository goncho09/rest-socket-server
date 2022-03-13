const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');

const { login, googleSignin, renovarToken } = require('../controllers/auth');

const router = Router();

router.get('/', validarJWT, renovarToken);

router.post(
    '/login', [
        check('correo', 'El correo es obligatorio').not().isEmpty(),
        check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos,
    ],
    login
);

router.post(
    '/google', [check('id_token', 'El id_token es necesario').not().isEmpty(), validarCampos],
    googleSignin
);

module.exports = router;