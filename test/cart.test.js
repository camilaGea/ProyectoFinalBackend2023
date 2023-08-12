import mongoose from 'mongoose'
import CartsService from '../src/services/cart.service.js'
import chai from 'chai'
import supertest from 'supertest'

mongoose.connect('mongodb+srv://camilagea4:tipa1527@cluster0.tuiclhb.mongodb.net/ecommerce?retryWrites=true&w=majority')

const expect = chai.expect
const requester = supertest('http://localhost:3000')

describe('Testing Carts Dao', ()=>{
    before(function(){
        this.cartsService = new CartsService
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    it('Nuestro dao debe poder crear un carrito nuevo', async function(){
        const {
            statusCode,
            ok,
            _body
        } = await requester.post('/api/carts')

        // console.log(_body.payload)
        expect(typeof _body.payload, 'object').to.be.ok
    })
    it('Nuestro dao debe poder agregar productos al carrito', async function(){
        const {
            statusCode,
            ok,
            _body
        } = await requester.post('/api/carts/64d6bc0acd5c6b37d36b9252/product/645aea2bc6adfa657b031fb5')

        console.log(_body)
        expect(typeof _body.data, 'object').to.be.ok
    })
    
    it('Nuestro dao debe poder eliminar productos del carrito', async function(){
        const {
            statusCode,
            ok,
            _body
        } = await requester.delete('/api/carts/64a5d5e8b8b1e9a84fcad606/products/64ac6be7e3ebf0228f991c15')

        console.log(_body)
        expect(typeof _body.data, 'object').to.be.ok
    })
})