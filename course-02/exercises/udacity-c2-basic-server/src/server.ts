import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessible as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query parameter
  app.get( "/cars/", ( req: Request, res: Response ) => {
    let { make } = req.query;
    cars_list

    if ( !make ) {
      return res.status(200)
                .send(cars_list);
    }
    
    let cars_by_make:Car[] = [];
    for (var i=0; i < cars_list.length; i++) {      
      if (cars_list[i].make === make) {
        cars_by_make.push(cars_list[i])
      }
    };

    if (cars_by_make.length > 0) {
      return res.status(200)
                .send(cars_by_make);
    }
    else {
      return res.status(404)
                .send(`Couldn't find a car with the make '${make}'`);
    }
  } );

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get( "/cars/:id", 
    ( req: Request, res: Response ) => {
      let { id } = req.params;
      
      if ( !id ) {
        return res.status(400)
                  .send(`id is required`);
      }

      let id_val = Number(id);

      for (var i=0; i < cars_list.length; i++) {
        if (cars_list[i].id === id_val) {
          
          return res.status(200)
                    .send(cars_list[i]);
        }
      };

      return res.status(404)
                .send(`Couldn't find a car with the id '${id}'`);
  } );

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, make and cost
  app.post( "/cars", 
    async ( req: Request, res: Response ) => {

      const {id, type, model, make, cost} = req.body;

      if ( !id || !make || !type || !cost ) {
        return res.status(400)
                  .send(`Required parameters include 'id', 'type', 'model', 'make' and 'cost'`)
      }

      const new_car: Car = {
        make:make, type:type, id:id, model:model, cost:cost
      }
      cars_list.push(new_car);
      return res.status(201)
                .send(new_car);
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();