import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initViewRoutes from "./route/web";
require('dotenv').config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initViewRoutes(app);

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Listening to the PORT:", port)
})