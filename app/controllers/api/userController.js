const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/save', (req, res, next) => {
    req.checkBody('txtUsername').trim().notEmpty();
    req.checkBody('txtPassword').trim().notEmpty();
    req.checkBody('txtName').trim().notEmpty();

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
        let name = req.body.txtName;

        let user = new User({
            userName: userName,
            password: password,
            name: name
        });

        if(id !== null && id !== undefined && id !== 0 && id !== '') {
            //console.log(id);
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
                    result.name = name;

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

router.delete('/delete/:id', (req, res, next) => {
    let id = req.params.id;

    if(id !== null && id !== undefined){
        User.findByIdAndRemove(id, (err) => {
            if(err){
                res.send({
                    success:false,
                    message: res.__('message.delete.fail.yourself')
                });
            }else{
                res.send({
                    success:true,
                    message: 'Usuario Eliminado'
                });
            }
        });
    }

});

router.get('/get', (req, res, next) => {
    User.find({}, 'userName password name').exec((err, userList) =>{
        if(err){
            res.send({
                success: false,
                message:res.__('message.get.fail'),
                data: err
            });
        }else{
            res.send({data: userList});
        }
    });
})


module.exports = router;