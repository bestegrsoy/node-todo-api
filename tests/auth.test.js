const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

beforeEach(async () => {
    await User.deleteMany({});  // Her testten önce tüm kullanıcıları sil
});

afterAll(async () => {
    await mongoose.connection.close();  // Test bitince DB bağlantısını kapat
});

describe('Auth Endpoints', () => {

    test('Register - Başarılı kayıt', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'test1@example.com',
                password: '123456'
            });
        
        expect(response.status).toBe(201);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });

    test('Register - Aynı email ile tekrar kayıt (hata vermeli)', async () => {
       // Önce bir kullanıcı kaydet 
        await request(app)
            .post('/auth/register')
            .send({
                email: 'duplicate@example.com',
                password: '123456'
            });
        
        // Aynı email ile tekrar kayıt dene
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'duplicate@example.com',
                password: '123456'
            });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('email'); // Response body'deki error mesajı "email" kelimesini içermeli. 
        // toContain() → String'in içinde arama yapar.
    });

    test('Login - Başarılı Giriş', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                email: 'test3@example.com',
                password: '123456'
            });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'test3@example.com',
                password: '123456'
            });
        
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });

    test('Login - Yanlış şifre (401 vermeli)', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                email: 'test4@example.com',
                password: '123456'
            });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'test4@example.com',
                password: '1234567'
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Şifre hatalı');
    });
});