module.exports = {
  apps: [{
    name: "elm-server",
    script: "./dist/server.js",
    watch: "./dist",
    error_file: "./logs/err.log",//错误输出日志
    out_file: "./logs/out.log",  //日志
    log_date_format: "YYYY-MM-DD HH:mm Z", //日期格式
    env_production: {
      "NODE_ENV": "production" // 环境变量
    },
    env_production: {
      NODE_ENV: "production",
      HOST: "127.0.0.0",
      PORT: 3000,
    }
  }],

  deploy: {
    production: {
      user: "root",
      host: [{
        host: "121.5.32.253",
        port: "22"
      }],
      ref: "origin/master",
      repo: "git@github.com:wanting615/sever-ts.git",
      path: "/www/app-server/",
      env: {
        "NODE_ENV": "production"
      },
      ssh_options: "StrictHostKeyChecking=no",
      "pre-deploy-local": "echo '生产环境部署中'",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js --env production"
    }
  }
};
