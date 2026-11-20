module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      url: ['http://localhost/'],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci'
    }
  }
};
