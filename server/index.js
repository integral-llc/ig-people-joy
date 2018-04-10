const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cors = require('cors');
const authenticationRequired = require("./oktaMiddleware").authenticationRequired;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  const port = process.env.PORT || 3003;

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

  // All remaining requests return the React app, so it can handle routing.
  router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  /**
   * For local testing only!  Enables CORS for all domains
   */
  app.use(cors());

  app.use('/api', router);

  app.listen(port, () => {
    console.error(`Node cluster worker ${process.pid}: listening on port ${port}`);
  });
}
