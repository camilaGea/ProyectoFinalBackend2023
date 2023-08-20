export const adminAccess = (req, res, next) => {
    if(req.session.user && req.session.user.rol == 'admin'){
        next()
    }
    res.send('usted no es admin')
}

export const userAccess = (req, res, next) => {
    if(req.session.user && req.session.user.rol == 'usuario'){
        next()
    }
    res.send('usted no es usuario')
}
export const premiumAccess = (req, res, next) => {
    if(req.session.user && req.session.user.rol == 'premium'){
        next()
    }
    res.send('usted no es premium')
}

export function rollPremiumVerify(req, res, next) {
    if (req.session?.premium) return res.status(401).send('Usted no puede adquirir su propio producto')
    return next()
}

export function rollDeleteVerify(req, res, next) {
    if (req.session?.admin) return next()
    if (req.session?.premium) return next()
    return res.status(401).send('Usted no tiene permisos')
}