//require('dotenv').config({path:'./env'})


import dotenv from  "dotenv"
import { connect } from "mongoose"
import connectDB from "./db/index.js"
import { app } from "./app.js"


if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: './.env'
  })
}

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is Listening at port : ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server encountered an error: ", error);
      process.exit(1); 
    });
  })
  .catch((err) => {
    console.log('MONGODB CONNECTION FAILED !!!', err);
  });


