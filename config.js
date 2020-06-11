
module.exports = {
  port: 34001,
  db: {
    port:process.env.MYSQL_PORT || 3306,
    host :process.env.MYSQL_HOST || 'localhost',
    user :process.env.MYSQL_USER || 'root',
    password : process.env.MYSQL_PASS || '',
    database :  process.env.MYSQL_DATABASE ||  'project_vehicle',
    timezone: 'asia/bangkok',
  },
  socket: {
    url: 'https://socket.bpcd.xenex.io',
    user: 'bpcd',
    pass: 'bpcd!@1234',
  },
}
