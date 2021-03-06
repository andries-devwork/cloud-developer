import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import { FilteredImageRouter } from './controllers/v0/filteredimage/routes/filteredimage.router';

const router: Router = Router();

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Create a `filteredimage` endpoint
  app.use('/filteredimage', FilteredImageRouter);
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();