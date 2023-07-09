export const adminAccess = (req, res, next) => {
    //console.log('PASO POR EL VERIFICADOR')
    //console.log(req.session)
    if(req.session.user && req.session.user.rol == 'admin'){
        next()
    }
    res.send('usted no es admin')
}

export const userAccess = (req, res, next) => {
    //console.log('PASO POR EL VERIFICADOR')
    //console.log(req.session)
    if(req.session.user && req.session.user.rol == 'usuario'){
        next()
    }
    res.send('usted no es usuario')
}