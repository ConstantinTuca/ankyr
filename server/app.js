const cluster = require('cluster');
const worker = process.env.WEB_CONCURRENCY || 1;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
	// Fork workers.
	for (var i = 0; i < worker; i++) {
		cluster.fork({RUN_CRON : i === 0 });
	}

	Object.keys(cluster.workers).forEach(function (id) {
		console.log("I am running with ID : " + cluster.workers[id].process.pid);
	});

	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
		if (signal) {
			console.log(`worker was killed by signal: ${signal}`);
		} else if (code !== 0) {
			console.log(`worker exited with error code: ${code}`);
		} else {
			console.log('worker success!');
		}
		cluster.fork();
	});
} else {
  const config         = require('./init/config').init();
  const PORT           = process.env.PORT || 2020;
  const app            = require("express")();
  const cors           = { origin: "http://localhost:4000", methods: ["GET", "POST"], transports: ['websocket'], credentials: true };
  const server         = require('http').createServer(app);
  const io             = require('socket.io')(server, {'transports': ['websocket'], pingInterval: 15000, pingTimeout: 30000, cors: config.env === 'dev' ? cors : {}, allowEIO3: config.env === 'dev' ? true : false});
  const phantomInit    = require('./init/phantomInit');
  const emailTransport = require('./init/emailTransport');

  const { createClient } = require("redis");
  const { createAdapter } = require("@socket.io/redis-adapter");

  const pubClient = createClient({
    //url: config.redisTls ? process.env.REDIS_TLS_URL : process.env.REDIS_URL,
    url: process.env.REDIS_URL,
    socket: {
      tls: process.env.REDIS_TLS ? process.env.REDIS_TLS : false,
      rejectUnauthorized: false
    }
  });
  const subClient = pubClient.duplicate();
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    //console.log('redis client connect', e);
    io.adapter(createAdapter(pubClient, subClient));
  }).catch(e => console.log('pubClient & subClient connect', e));

  // pubClient.connect().then(() => console.log('redis client connect')).catch(e => console.log(e));
  pubClient.on("connect", () => console.log('pubClient connect'));
  pubClient.on("error", (err) => console.log('pubClient error', err));
  pubClient.on("ready", () => console.log('pubClient ready'));
  pubClient.on("reconnecting", () => console.log('pubClient reconnecting'));
  pubClient.on("end", () => console.log('pubClient end'));

  process.env.TZ = 'Europe/Bucharest';
  global.NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

  global.config = config;

  Promise.all([phantomInit.createPhantomSession(app)]).then(values => {
    // app.locals.config = config;
    // app.locals.db = values[0];
    // app.locals.ph = values[1];
    // app.locals.email = global.smtpTransportYour = values[2];
    app.io = io;

    require('./init/express')(app, config);
    require('./routes')(app);

    io.of('/').adapter.on('error', err => console.error('ERROR no redis server', err));

    server.listen(PORT, config.ip, () => {
      console.info('Listening on port: %d, env: %s', PORT, config.env);
      process.on('exit', () => {
        console.info('exiting phantom session');
        app.locals.ph.exit();
      });
    });
  }).catch(e => console.error('Init sequence error: ', e));
}