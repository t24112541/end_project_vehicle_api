
module.exports = {
  // port: 7000,
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 34001,
    user: process.env.MYSQL_USER || 'root',
    pass: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DATABASE || 'project_vehicle',
  },
  socket: {
    url: 'https://socket.bpcd.xenex.io',
    user: 'bpcd',
    pass: 'bpcd!@1234',
  },
}