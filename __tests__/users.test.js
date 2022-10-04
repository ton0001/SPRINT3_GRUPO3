const request = require('supertest');
const { app , server} = require('../server');
const { generateJWT } = require('../helpers/generateJWT');

const { sequelize } = require('../database/models');
const initModels = require('../database/models/init-models');
const models = initModels(sequelize);


afterEach(() => {
    server.close();
    jest.setTimeout(30000);
 });



 describe('DELETE /api/v3/users/:id', () => {

    test('Borrar un usuario, debe devolver codigo 200', async () => {
        const god_user = {
            id: 23,
            username: "pitu"
        }
       const id = 5
       const token = await generateJWT(god_user);
 
       const { statusCode, body } = await request(app).delete(`/api/v3/users/${id}`).auth(token, {type: 'bearer'});
       expect(statusCode).toBe(200);
       expect(body).toEqual(expect.objectContaining({
             msg: expect.any(String),
             ok: expect.any(Boolean)
          })
       );

       newuser = {
        id: 5,
        email: 'hola@gmail.com',
        username: 'elusername',
        password: 123456,
        first_name: 'hector',
        last_name:  'op'

       }
       //vuelvo a crear el usuario borrado!
       await models.users.create(newuser)
       await models.carts.create({
        user_id : newuser.id })

    
    });

    test('Error al borrar un usuario con productos en el carrito', async () => {
        const god_user = {
            id: 23,
            username: "pitu"
        }
       const id = "3"
       const token = await generateJWT(god_user);
 
       const { statusCode, body } = await request(app).delete(`/api/v3/users/${id}`).auth(token, {type: 'bearer'});
       expect(statusCode).toBe(400);
       expect(body).toEqual(expect.objectContaining({
             msg: expect.any(String),
             ok: expect.any(Boolean)
          })
       );

 
    });
 
    test('Error al borrar un usuario que no existe', async () => {
        const god_user = {
            id: 23,
            username: "pitu"
        }
       const id = "99"
       const token = await generateJWT(god_user);
 
       const { statusCode, body } = await request(app).delete(`/api/v3/users/${id}`).auth(token, {type: 'bearer'});
       expect(statusCode).toBe(404);
       expect(body).toEqual(expect.objectContaining({
             msg: expect.any(String),
             ok: expect.any(Boolean)
          })
       );
       
    });
 
 });

 

 describe('PUT /api/v3/users/:id', () => {

    test('Actualizar usuario, debe devolver codigo 200', async () => {
        const god_user = {
            id: 23,
            username: "pitu"
        }
       const id = 6
       const token = await generateJWT(god_user);

        //genero un string random
        randomString  = (Math.random().toString(36).substr(2, 7))
       const data = {
        "username": randomString,
        "email": randomString + "@gmail.com",
        "password": 123456,
        "first_name": "Eduardo",
        "last_name": "Umber",
     };
 
       const { statusCode, body } = await request(app).put(`/api/v3/users/${id}`).auth(token, {type: 'bearer'}).send(data);
        expect(statusCode).toBe(200);
       expect(body).toEqual(expect.objectContaining({
           id: expect.any(Number),
           username: expect.any(String),
           first_name: expect.any(String),
           last_name: expect.any(String),
           profilepic: expect.any(String),
           role: expect.any(String),
           email: expect.any(String),  
        })
     );

     
    });

    test('Debe retornar un codigo 404 si el id no existe', async () => {
        const god_user = {
            id: 23,
            username: "pitu"
        }
       const id = 99
       const token = await generateJWT(god_user);

        const data = {
           "username": "Eduard9",
           "email": "eduardo9@gmail.com",
           "password": 123456
        };
  
        const { statusCode, body } = await request(app).put(`/api/v3/users/${id}`).auth(token, {type: 'bearer'}).send(data);
        expect(statusCode).toBe(404);
               expect(body).toEqual(expect.objectContaining({
                     msg: expect.any(String),
                     ok: expect.any(Boolean)
                  })
               );
        
     });

     test('Debe retornar un codigo 400 si el email o username ya existen', async () => {
        const god_user = {
            id: 23,
            username: "pitu"
        }
       const id = 6
       const token = await generateJWT(god_user);

        const data = {
           "username": "victoria",
           "email": "v@gmail.com",
           "password": 123456
        };
  
        const { statusCode } = await request(app).put(`/api/v3/users/${id}`).auth(token, {type: 'bearer'}).send(data);
        expect(statusCode).toBe(400);  
        
  
     });

 
 });