# beautofuel

This repository contains application for controlled exeperiment in natural field that provides 4 main modules:

- custom user interface for participants of the experiment that was developed for 2 controlled groups and 3 phases (container _next_)
- customized content management system (container _strapi_)
- micro-service for [enviroCar](https://envirocar.org/) data import and processing (container _updater_)
- experiment live data monitoring tool _Grafana_ (container _grafana_)

This application had been used by 11 users for the period of 1 and a half month in early 2021 in order to collect research data.

## Minimal Requirements

Make sure your machine satisfies all the requirements below before you proceed any further.

```
 -----------------------------------------------------------
| What			|			Version			| 		Note										|
 -----------------------------------------------------------
| Docker 		|			v3.1.0			|			with Docker Compose			|
 -----------------------------------------------------------
| Python 		|		 	v3.8.5			|															|
 -----------------------------------------------------------
| Node 			|		 	v14.16.0		|															|
 -----------------------------------------------------------
```

## Initial Configuration

Go through the following steps before starting the project in either _development_ or _production_ environment:

1. Setup appropriate environment variables for all project modules (example always available in the same folder as the original file with the filename ending as `.env.example` if is file with environment variables)
   - `/src/grafana/.db.env` - _grafanadb_ credentials
   - `/src/next/.env` - _Google Sign-In_ credentails, _NextAuth.js_ URL and _strapi_ container URL
   - `/src/strapi/.env` - _strapi_ and _updater_ containers URLs, _strapidb_ and _grafanadb_ credentials, `ON_VPS` toggle
   - `/src/strapi/.db.env` - _strapidb_ credentials
   - `/src/updater/app/lib/utils/constants.py` - _strapi_ URL and access token (tutorial on how to create it below), _grafanadb_ credentials
2. Appropriately configure `strapi`
   1. Run the container in either _development_ or _production_ environment
   2. Create _token_
   3. Create _user_ with username _updater_
   4. Create _phase_
   5. Create _recommendations_ (before 2nd phase of the experiment starts)
   6. Create _products_ (before 2nd phase of the experiment starts)
   7. Set-up permissions on endpoints for both _Authenticated_ and _Public_ roles as follows:
      - role _Authenticated_:
        - section _APPLICATION_
          - _ENVIROCAR_: usercredentialsvalid
          - _PHASE_: find
          - _PURCHASES_: update
          - _RECOMMENDATIONS_: findone
          - _SYNCHRONIZATIONS_: create, findone
          - _TRACKS_: count, create, find, top10, top10position, top10stats
        - _USERS-PERMISSIONS_
          - _AUTH_: connect
          - _USER_: findone, me, update
      - role _Public_:
        - section _APPLICATION_
          - _PHASE_: find
          - _TRACKS_: top10, top10stats
        - section _USERS-PERMISSIONS_
          - _AUTH_: callback, connect, emailconfirmation, forgotpassword, register, resetpassword
          - _USER_: me
   8. Turn off registration with e-mail
   9. Enable Google provider
3. Open `grafana` and configure data source for InfluxDB

## Run Project

If you managed to configure all the application modules, you can start developing and deploying in the following workflow:

1. Develop new features in *development* environment
2. Test new features in *development* environment
3. Test new features in *production* environment
4. Release new version to *production* environment

### Development

I recommend starting up the application for development in the order as described below.

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

1. `cd docker/prod`
2. `docker-compose build`
3. `docker-compose up`

## Helpers

### hook at Docker container's CLI

`docker exec -it <HASH> /bin/sh; exit`

