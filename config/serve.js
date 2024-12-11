const concurrently = require('concurrently')
const args = process.argv.slice(2).join(' ')

concurrently(
  [
    { command: 'npx lite-server', prefixColor: 'blue', name: 'lite-server' },
    {
      command: 'vue-cli-service serve ' + args,
      name: 'dev'
    }
  ],
  {
    killOthers: ['failure', 'success']
  }
)
