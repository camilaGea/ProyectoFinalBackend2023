import mongoose from 'mongoose'
import ProductsService from '../src/services/products.services.js'
import chai from 'chai'
import supertest from 'supertest'

mongoose.connect('mongodb+srv://camilagea4:tipa1527@cluster0.tuiclhb.mongodb.net/ecommerce?retryWrites=true&w=majority')

const expect = chai.expect
const requester = supertest('http://localhost:3000')

describe('Testing Products Dao', ()=>{
    before(function(){
        this.productsService = new ProductsService
    })
    beforeEach(function(){
        this.timeout(5000)
    })

    
    it('Nuestro dao debe poder obtener los productos', async function(){
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/api/products')
        expect(typeof _body, 'object').to.be.ok
    })
    
    it('Nuestro dao debe poder obtener un unico producto', async function (){
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/api/products/645aea2bc6adfa657b031fb5')
        // console.log(_body);
        expect(typeof _body, 'object').to.be.ok
    })
    it('Nuestro dao debe poder agregar un producto', async function (){
        let ProductMock ={
            owner: 'admin',
            title: 'TEST',
            description: 'TEST',
            code: 73,
            price: 1500,
            status: 'true',
            stock: 4,
            category: 'mails',
            thumbnail: 'link',
        }

        const {
            statusCode,
            ok,
            _body
        } = await requester.post('/api/products').send(ProductMock)

        expect(_body.producto._id).to.be.ok
    })
})