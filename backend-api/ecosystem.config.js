module.exports = {
  apps: [
    {
      script: './app.js',
      name: 'crypto-service-new',
      watch: './src',
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'staging',
      },
    },
  ],
};