const winston = require('winston');

const getLogger = () => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  return logger;
};

module.exports = getLogger;

/*
This is a logger file that allows me to log any errors that occur. I am using winston as the module since it allows me to clearly store the errors.
If an error is caughted, it will create two new files in the root directory called `error.log` and `combined.log`. If the level of the error is
equal to `error` (level description may be found under this link: https://www.npmjs.com/package/winston ) it will be stored inside error.log and combined.log.
All other errors will always be saved to combined.log.
*/
