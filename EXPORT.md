# Export

In order to export data from databases (MongoDB and InfluxDB) that are being used in the solution, you will need to open ports of database containers in production's `docker-compose.yml` file first. In order to do that, uncomment the lines in that file where the ports are specified and you will be ready right after the restart of those containers.

## InfluxDB

Install the `influx` CLI and execute the following commands from your terminal:

```bash
# Track Features collection
influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM trackFeatures' -format csv > influxdb-trackfeatures.csv
# Tracks collection
influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM tracks' -format csv > influxdb-tracks.csv
# Synchronizations collection
influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM synchronizations' -format csv > influxdb-synchronizations.csv
# Purchases collection
influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM purchases' -format csv > influxdb-purchases.csv
```

### One-liner

```bash
influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM trackFeatures' -format csv > influxdb-trackfeatures.csv && influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM tracks' -format csv > influxdb-tracks.csv && influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM synchronizations' -format csv > influxdb-synchronizations.csv && influx -host 'host' -port 'port' -username 'username' -password 'password' -database 'db' -execute 'SELECT * FROM purchases' -format csv > influxdb-purchases.csv
```

## MongoDB

Install the `mongoexport` CLI and execute the following commands from your terminal:

```bash
# Tracks collection
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=tracks --out=mongodb-tracks.csv
# Wallets collection
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=wallets --out=mongodb-wallets.csv
# Synchronizations collection
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=synchronizations --out=mongodb-synchronizations.csv
# Transactions collection
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=transactions --out=mongodb-transactions.csv
# Purchases collection
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=purchases --out=mongodb-purchases.csv
# Recommendations collection
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=recommendations --out=mongodb-recommendations.csv
```

### One-liner

```bash
mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=tracks --out=mongodb-tracks.csv && mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=wallets --out=mongodb-wallets.csv && mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=synchronizations --out=mongodb-synchronizations.csv && mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=transactions --out=mongodb-transactions.csv && mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=purchases --out=mongodb-purchases.csv && mongoexport --uri="mongodb://username:password@host:port/db?authSource=admin" --collection=recommendations --out=mongodb-recommendations.csv
```