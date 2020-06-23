let server = {}

let serverInit = async (app, PORT = 2019, HOST = '0.0.0.0') => {
  
  return new Promise((resolve, reject) => {
    if (server[`p${PORT}`]) throw new Error('Server is already running')
    _server = app.listen(PORT, HOST, () => {
      console.info(`Express Server ${HOST}:${PORT}`)
      server[`p${PORT}`] = _server
      resolve(_server)
    })
  });
}

const getServer = (id) => server[id]

module.exports = {
  serverInit,
  getServer
}