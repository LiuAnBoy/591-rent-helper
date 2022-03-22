import express, { Application } from 'express';

import Locals from './Locals';
import Routes from './Routes';
import Bootstrap from '../middlewares/index';
import ExceptionHandler from '../exception/Handler';
import Task from './Task';
import WakeUpDyno from '../controllers/WakeUpDyno';

class Express {
  /**
   * Create the express object
   */
  public express: Application;

  /**
   * Initializes the express server
   */
  constructor() {
    this.express = express();

    this.mountDotEnv();
    this.mountMiddlewares();
    this.mountRoutes();

    Task.token();
    Task.rent();
  }

  private mountDotEnv(): void {
    this.express = Locals.init(this.express);
  }

  private mountRoutes(): void {
    this.express = Routes.mountApi(this.express);
  }

  /**
   * Mounts all the defined middlewares
   */
  private mountMiddlewares(): void {
    this.express = Bootstrap.init(this.express);
  }

  /**
   * Starts the express server
   */
  public init(): any {
    const port: number = Locals.config().port;

    // Registering Exception / Error Handlers
    this.express.use(ExceptionHandler.errorHandler);

    // Start ther server on the specified port
    if (process.env.NODE_ENV === 'production') {
      WakeUpDyno('https://rent-591-helper.herokuapp.com/');
    }
    if (process.env.NODE_ENV === 'development') {
      this.express
        .listen(port, () => {
          return console.log(
            '\x1b[33m%s\x1b[0m',
            `Server   :: Running @ 'http://localhost:${port}'`
          );
        })
        .on('error', (_error) => {
          return console.log('Error: ', _error.message);
        });
    }
  }
}

export default new Express();
