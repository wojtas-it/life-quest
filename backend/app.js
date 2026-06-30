// Punkt wejścia dla hostingu Node.js na small.pl / MyDevil.
// Hosting uruchamia app.js i podstawia port w process.env.PORT,
// a nasz server.js nasłuchuje na process.env.PORT || 5000.
require('./server.js');
