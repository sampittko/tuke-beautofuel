FROM python:3.8.6

RUN pip3 install fastapi uvicorn requests pydantic geopandas pandas numpy matplotlib pydeck ipython folium seaborn scipy shapely branca scikit-learn geopy statistics plotly datetime influxdb python-dateutil osmnx

EXPOSE 1338

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "1338"]