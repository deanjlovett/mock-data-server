const server = require('./server');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Hey bro! Check me out on http://localhost:${PORT}`));