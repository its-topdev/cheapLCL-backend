module.exports = {
   apps : [{
     name : "cheap-api-prod",
     script: "./app.js",
     log_date_format: "YYYY-MM-DD HH:mm Z",
     env_production: {
        NODE_ENV: "production"
     },
     env_staging: {
        NODE_ENV: "staging"
     },
     watch: true,
     ignore_watch : ["node_modules"],
     post_reload : "NODE_ENV=production sequelize db:migrate",
   }]
 }
