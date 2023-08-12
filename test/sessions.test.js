import mongoose from 'mongoose'
import UserService from '../src/services/user.services.js'
import chai from 'chai'
import supertest from 'supertest'

mongoose.connect('mongodb+srv://camilagea4:tipa1527@cluster0.tuiclhb.mongodb.net/ecommerce?retryWrites=true&w=majority')

const expect = chai.expect
const requester = supertest('http://localhost:3000')

describe('Testing Sessions Dao', ()=>{
    before(function(){
        this.userService = new UserService
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    it('Nuestro dao debe poder registrar un usuario', async function(){
        let UserMock = {
            nombre: 'cami',
            apellido:'gea',
            email: 'camigea@hotmail.com.ar',
            edad:'22',
            password: '1234'
        }
        const {
            statusCode,
            ok,
            _body
        } = await requester.post('/api/sessions/register').send(UserMock)
        expect(typeof _body, 'object').to.be.ok
    })
    it('Nuestro dao debe poder loguear un usuario', async function(){
        let UserMock = {
            email: 'camigea@hotmail.com.ar',
            password: '1234'
        }
        const {
            statusCode,
            ok,
            _body
        } = await requester.post('/api/sessions/login').send(UserMock)

        console.log(_body)
        expect(typeof _body, 'object').to.be.ok
    })
    it('Nuestro dao debe poder Desoguear un usuario', async function(){
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/api/sessions/logout')
        expect(typeof _body, 'object').to.be.ok
    })

})