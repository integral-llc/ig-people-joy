const express = require('express');
const app = express();
const bodyParser = require('body-parser');
import {authenticationRequired} from "./oktaMiddleware";

const cors = require('cors');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3003;

const router = express.Router();

router.get('/', (req, res) => {
  res.json({'message': 'root api', date: new Date()});
});

router.get('/secure', authenticationRequired, (req, res) => {
  res.json({
    message: 'Coming from the secure connection.',
    jwt: req.jwt,
    date: new Date()
  });
});

/**
 * For local testing only!  Enables CORS for all domains
 */
app.use(cors());

app.use('/api', router);

app.listen(port, () => {
  console.log('Server has started on port: ', port);
});
