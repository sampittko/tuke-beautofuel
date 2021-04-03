# beautofuel

This repository contains application for controlled exeperiment in natural field that provides 4 main modules:

- custom user interface for participants of the experiment that was developed for 2 controlled groups and 3 phases (container **next**)
- customized content management system (container **strapi**)
- micro-service for [enviroCar](https://envirocar.org/) data import and processing (container **updater**)
- experiment live data monitoring tool Grafana (container **grafana**)

This application had been used by 11 users for the period of 1 and a half month in early 2021 in order to collect research data.

## Minimal Requirements

Make sure your machine satisfies all the requirements below before you proceed any further and also make sure that you install Docker with Docker Compose included.

```
          |   Version
-------------------------
Docker    |   v3.1.0
Python    |   v3.8.5
Node      |   v14.16.0
```

## Initial Configuration

Go through the following steps before starting the project in either development or production environment:

1. Setup appropriate environment variables for all project modules (example always available in the same folder as the original file with the filename ending as `.env.example` if is file with environment variables)
   - `/src/grafana/.db.env` - **grafanadb** credentials
   - `/src/next/.env` - Google Sign-In credentails, NextAuth.js URL and **strapi** container URL
   - `/src/strapi/.env` - **strapi** and **updater** containers URLs, **strapidb** and **grafanadb** credentials, `ON_VPS` toggle
   - `/src/strapi/.db.env` - **strapidb** credentials
   - `/src/updater/app/lib/utils/constants.py` - **strapi** URL and access token (tutorial on how to create it below), **grafanadb** credentials
2. Create project for Google Sign-In inside Google Developers Console and save client ID and client secret for authentication configuration in the next step
3. Appropriately configure **strapi**
   1. Run the container in either development or production environment
   2. Create token
   3. Create user with username *updater*
   4. Create phase
   5. Create recommendations (before 2nd phase of the experiment starts)
   6. Create products (before 2nd phase of the experiment starts)
   7. Set-up permissions on endpoints for both Authenticated and Public roles as follows:
      - role Authenticated:
        - section Application:
          - <u>envirocar</u>: usercredentialsvalid
          - <u>phase</u>: find
          - <u>purchases</u>: update
          - <u>recommendations</u>: findone
          - <u>synchronizations</u>: create, findone
          - <u>tracks</u>: count, create, find, top10, top10position, top10stats
        - section Users-permissions:
          - <u>auth</u>: connect
          - <u>user</u>: findone, me, update
      - role Public:
        - section Application:
          - <u>phase</u>: find
          - <u>tracks</u>: top10, top10stats
        - section Users-permissions:
          - <u>auth</u>: callback, connect, emailconfirmation, forgotpassword, register, resetpassword
          - <u>user</u>: me
   8. Turn off registration with e-mail
   9. Enable Google provider
4. Open **grafana** and configure data source for InfluxDB

## Run Project

If you managed to configure all the application modules, you can start developing and deploying in the following workflow:

1. Develop new features in development environment
2. Test new features in development environment
3. Test new features in production environment
4. Release new version to production environment

### Development

I recommend starting up the application for development in order as described below.

#### Docker

1. `cd docker/dev`
2. `docker-compose build`
3. `docker-compose up`

#### updater

1. Optionally set Python virtual environment where you will want to install the dependencies
2. `pip3 install fastapi uvicorn requests pydantic geopandas pandas numpy matplotlib pydeck ipython folium seaborn scipy shapely branca scikit-learn geopy statistics plotly datetime influxdb python-dateutil osmnx`
3. `cd src/updater/app`
4. `uvicorn main:app --reload --port 1338`

#### strapi

1. `cd src/strapi`
2. `yarn install`
3. `yarn dev`

#### next

1. `cd src/next`
2. `yarn install`
3. `yarn dev`

### Production

The only requirement for starting up application in the production _environment_ is to turn on all Docker containers with the following sequence of commands:

1. `cd docker/prod`
2. `docker-compose build`
3. `docker-compose up`

## Helpers

- hook at Docker container's CLI: `docker exec -it <HASH> /bin/sh; exit`
- export data from databases that the solution uses to analyze them locally in seconds thanks to this [tutorial](https://github.com/sampittko/tuke-beautofuel/blob/main/EXPORT.md) that I prepared

## License

This project is under the MIT license which is great! Read more inside [LICENSE](https://github.com/sampittko/tuke-beautofuel/blob/main/LICENSE).
