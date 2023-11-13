const { Pool } = require('pg');

class PostgresConnectionPoolManager {
  constructor() {
    this.connectionPools = new Map();
  }

  getConnectionPool(dbName) {
    if (this.connectionPools.has(dbName)) {
      return this.connectionPools.get(dbName);
    } else {
      return null;
    }
  }
  setConnectionPool(dbName,pool){
    if(!this.connectionPools.has(dbName)){
        this.connectionPools.set(dbName,pool);
    }else {
        throw new Error("Duplicate entry in PostgresConnectionPool.");
    }
  }
}

// Create and export a singleton instance of the PostgresConnectionPoolManager
const singletonInstance = (function () {
  let instance;

  function createInstance() {
    return new PostgresConnectionPoolManager();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

module.exports = singletonInstance.getInstance(); // Export the singleton instance
