const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/save', (req, res, next) => {
    req.checkBody('txtUsername').trim().notEmpty();
    req.checkBody('txtPassword').trim().notEmpty();

    let errors = req.validationErrors();
    if(errors) {
        res.send({
            success: false,
            message: 'No se pudo guardar el usuario'
        });
    }else{
        let id = req.body.txtIdHidden;
        let userName = req.body.txtUsername;
        let password = req.body.txtPassword;

        let user = new User({
            userName: userName,
            password: password
        });

        if(id !== null && id !== undefined && id !== 0) {
            user._id = id;

            User.findById(id, (err, result) => {
                if(err) {
                    res.send({
                        success: false,
                        message: 'Error al actualizar el usuario',
                        data: err
                    });
                }else{
                    result.userName = userName;
                    result.password = password;

                    result.save((err) => {
                        if(err) {
                            res.send({
                                success: false,
                                message: 'Error al actualizar el usuario',
                                data: err
                            });
                        }else{
                            res.send({
                                success: true,
                                message: 'Usuario actualizado con exito',
                                data: user
                            });
                        }
                    });
                }
            });
        }else{
            user.save((err) => {
                if(err) {
                    res.send({
                        success: false,
                        message: 'Error al guardar el usuario',
                        data: err
                    });
                }else{
                    res.send({
                        success: true,
                        message: 'Usuario almacenado con exito',
                        data: user
                    });
                }
            });
        }
    }
});

module.exports = router;