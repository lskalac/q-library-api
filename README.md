# Q Library REST Api

- REST Api for managing users (admins and authors) and their books
- written in NestJS, using TypeORM orm and PostgreSQL

## How to start?
* open terminal at root directory
* execute ```yarn``` command
* create postgresql database (localy or on the server)
* execute command ``` CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; ``` in your database
* create .env file and copy/past the following
  ``` 
  DATABASE_HOST= 
  DATABASE_PORT= 
  DATABASE_NAME= 
  DATABASE_USER= 
  DATABASE_PASSWORD=
  JWT_SECRET_KEY=
  ```
  and populate values
  * execute command ```yarn start:dev```
   
## Where to find my api?
* api url: http://localhost:7000
* api docs: http://localhost:7000/docs

## Default admin
email: admin@admin.com <br />
password: admin
 
### Author notes
* all routes are authenticated (except auth/login) and 401 Exception can be thrown 
