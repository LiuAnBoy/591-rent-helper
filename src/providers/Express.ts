import express, { Application } from 'express';

import Locals from './Locals';
import Routes from './Routes';
import Bootstrap from '../middlewares/index';
import ExceptionHandler from '../exception/Handler';
import Task from './Task';

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
    Task.wakeUpDyno();
  }

  private mountDotEnv(): void {
    this.express = Locals.init(this.express);
  }

  private mountRoutes(): void {
    this.express = Routes.mountApi(this.express);
    this.express = Routes.mountWeb(this.express);
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
  public init() {
    const port: number = Locals.config().port;

    // Registering Exception / Error Handlers
    this.express.use(ExceptionHandler.errorHandler);

    // Start the server on the specified port
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

export default new Express();
