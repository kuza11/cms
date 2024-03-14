module.exports = {
  apps: [
    {
      script: "pnpm start",
    },
  ],

  deploy: {
    production: {
      user: "deploy",
      host: "localhost",
      ref: "origin/master",
      branch: "master",
      repo: "git@github.com:kuza11/cms.git",
      path: "/home/deploy/netlogy/skola",
      "pre-deploy-local": "",
      "post-deploy":
        "pnpm install && pnpm run build && pm2 reload ecosystem.config.js --env production && pnpm prisma db push",
      "pre-setup": "",
    },
  },
};
