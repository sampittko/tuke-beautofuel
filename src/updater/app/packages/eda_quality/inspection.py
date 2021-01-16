import pandas as pd
import seaborn as sns
import numpy as np 
import matplotlib.pyplot as plt
import plotly.express as px
import geopandas as gpd
from scipy import stats

from shapely.geometry import Polygon, MultiPoint
import json
from sklearn.cluster import DBSCAN
from geopy.distance import great_circle
from branca.colormap import linear
import folium
import datetime
from math import floor, ceil




# class Inspection():
#     def __init__(self):
#         print("Initializing class 'Inspection'")  


def skewness_num_variables(df): # show_skewness_num_variables
    numericFeaturesIndex = df.dtypes[df.dtypes=='float64'].index
    skewedFeatures=df[numericFeaturesIndex].skew().sort_values(ascending=False)
    skewness=pd.DataFrame({'Skew':skewedFeatures})
    return skewness


def missing_values_per_variable(df, percent=100, dropCol=False): # sum_missing_values
    listCol =[]
    rowCount = df.shape[0]
    for column in df:
        sumColumn = df[column].isna().sum()
        percentNA = sumColumn/rowCount*100
        if percentNA <= percent:
            listCol.append({'column':column ,'missing_values': sumColumn, 'missing_values(%)': percentNA})
        else: 
            if dropCol == True:
                print('Column dropped: ', column, ', missing values(%): ', percentNA )
                df.drop([column], axis=1, inplace=True)
    listCol = pd.DataFrame(listCol).sort_values(by='missing_values', ascending=False).reset_index(drop=True)
    return listCol


def missing_values_per_track(df):
    columnList=df.select_dtypes(['float64']).columns.tolist()
    df_count=df.groupby('track.id').apply(lambda x: x.isna().sum()) 
    df_prop=df.groupby('track.id').apply(lambda x: x.isna().sum()/len(x)*100)
    return df_count, df_prop


def get_classified_correlations(df, method):
    allCoeffs=[]
    correlationsMatrixAll = df.corr(method=method)
    for column in correlationsMatrixAll:
        for i in correlationsMatrixAll[column].index:
            df = correlationsMatrixAll.at[i, column]
            if df < 1.0:
                allCoeffs.append({'column':column, 'index':i, 'coefficient':df })

    correlationsMatrix = correlationsMatrixAll.where(np.tril(np.ones(correlationsMatrixAll.shape)).astype(np.bool))

    very_strong=[]
    strong=[]
    moderate=[]
    weak=[]   
    for column in correlationsMatrix:
        for i in correlationsMatrix[column].index:
            df = correlationsMatrix.at[i, column]
            if df >= 0.8 and df < 1.0 or df <= -0.8 and df > -1.0:
                very_strong.append({'column':column, 'index':i, 'coefficient':df })#   
            if df >= 0.6 and df < 0.8 or df <= -0.6 and df > -0.8:
                strong.append({'column':column, 'index':i, 'coefficient':df })
            if df >= 0.4 and df < 0.6 or df <= -0.4 and df > -0.6:
                moderate.append({'column':column, 'index':i, 'coefficient':df })
            if df < 0.4 and df > -0.4:
                weak.append({'column':column, 'index':i, 'coefficient':df })

    very_strong = pd.DataFrame(very_strong).sort_values(by='coefficient', ascending=False).reset_index(drop=True)
    strong = pd.DataFrame(strong).sort_values(by='coefficient', ascending=False).reset_index(drop=True)
    moderate = pd.DataFrame(moderate).sort_values(by='coefficient', ascending=False).reset_index(drop=True)
    weak=pd.DataFrame(weak).sort_values(by='coefficient', ascending=False).reset_index(drop=True)
    allCoeffs= pd.DataFrame(allCoeffs).sort_values(by='coefficient', ascending=False).reset_index(drop=True)

    return allCoeffs, very_strong, strong, moderate, weak 


def get_correlation(df, method, variable1, variable2):
    allCoeffs=[]
    correlationsMatrixAll = df.corr(method=method)
    for column in correlationsMatrixAll:
        for i in correlationsMatrixAll[column].index:
            df = correlationsMatrixAll.at[i, column]
            if df < 1.0:
                allCoeffs.append({'v1':column, 'v2':i, 'coefficient':df })

    correlationsMatrix = correlationsMatrixAll.where(np.tril(np.ones(correlationsMatrixAll.shape)).astype(np.bool))
    allCoeffs= pd.DataFrame(allCoeffs).sort_values(by='coefficient', ascending=False).reset_index(drop=True)
    showCorr= allCoeffs.loc[(allCoeffs['v1'] == variable1) & (allCoeffs['v2'] == variable2)]
    return showCorr
    
    
def correlation_heatmap_triangle(df, method, figsize=(20, 16)):
    df = df.select_dtypes(['float64'])
    coefficient = df.corr(method=method)
    coefficient = coefficient.where(np.tril(np.ones(coefficient.shape)).astype(np.bool))
    plt.figure(figsize=figsize)
    sns.heatmap(coefficient, annot = True, vmin=-1, vmax=1.0, cmap="RdBu_r")


def get_single_track(df, track_id):
    grouped = df.groupby('track.id')
    df = grouped.get_group(track_id).copy()
    return df


def show_dublicated_tracks(df):   
    dublicates = df[df[['geometry', 'Engine Load.value', 'Calculated MAF.value',
    'Speed.value', 'CO2.value', 'Intake Pressure.value', 'Rpm.value',
    'Intake Temperature.value', 'Consumption (GPS-based).value',
    'GPS Altitude.value', 'Throttle Position.value', 'GPS Bearing.value',
    'Consumption.value', 'GPS Accuracy.value',
    'CO2 Emission (GPS-based).value', 'GPS Speed.value', 
    'track.length', 'track.begin', 'track.end', 'sensor.type',
    'sensor.engineDisplacement', 'sensor.model', 'sensor.id',
    'sensor.fuelType', 'sensor.constructionYear', 'sensor.manufacturer']].
     duplicated(keep=False)==True]['track.id'].unique().tolist()

    newdf= df.copy().loc[df['track.id'].isin(dublicates)]
    ls= newdf['track.id'].unique().tolist()
    print('Dublicated tracks:', ls)
    return newdf



def count_tracks(df):
    print(len(df['track.id'].unique().tolist()))

def show_units(df):
    '''
        Aim: 
            get an overview of the variables and corresponding units
        
        Keyword Arguments: 
            df {Geodataframe} -- point input
        
        Output: Matrix-like overview on variables an the relevant unit
    '''
    units = df.filter(like='.unit').columns
    for unit in units:
        if unit in df:
            print(df[unit].name, df[unit].iloc[0])
    return units
    
def get_units(df):
    '''
        Aim: 
            get an overview of the variables and corresponding units

        Keyword Arguments: 
            df {Geodataframe} -- point input

        Output: Matrix-like overview on variables an the relevant unit
    '''
    units = df.filter(like='.unit').columns
    unitList=[]
    for unit in units:
        if unit in df:
            unitList.append(unit)
            #print(df[unit].name, df[unit].iloc[0])
    return(unitList)


def get_categories(df):
    for column in df:
        print(column, df[column].unique())


def get_sensor_columns(df):
    sensor = df.filter(like='sensor.', axis=1).columns.copy()
    sensor = sensor.tolist()
    df = df[sensor]
    return df, sensor


def get_columns(df, name=''):
    columns =  df.filter(like=name, axis=1).columns.copy()
    columns = columns.tolist()
    df = df[columns]
    return columns, df


def plot_tracks(points_df, column):
    """ 
    Aim: 
        Visualize phenomena of tracks as timeserie in Linechart, in which each line represents one single track

    Keyword Arguments: 
        df {Geodataframe} -- point input

    Returns:
        Chart is shown 

    """
    # Add datetime to data frame
    points_df['datetime'] = pd.to_datetime(points_df['time'])
    points_df['index']=points_df.index
    fig = px.line(points_df, x="index", y=column, color="track.id",
                  line_group="track.id", hover_name="datetime")
    fig.update_traces(mode='lines+markers')
    fig.show()



def plot_point_values(points, value = None):
    """ This function is based on a function from the envirocar fork of the github user 'annaformaniuk'.

    Aim: 
        show points on a map

    Keyword Arguments:
        points {GeoDataFrame} -- points input
        value {string} -- column value to use for colouring

    Returns:
        No Return
    """

    points['lat'] = points['geometry'].apply(lambda coord: coord.y)
    points['lng'] = points['geometry'].apply(lambda coord: coord.x)

    if value is not None:
    # Visualizing points of the selected variable
        fig = px.scatter_mapbox(points, lat="lat", lon="lng", hover_data=["CO2.value"],
                                color=value,
                                color_continuous_scale=px.colors.sequential.Reds,
                                title=value + " visualisation", zoom=8,
                                hover_name="id")
    else:
        fig = px.scatter_mapbox(points, lat="lat", lon="lng", hover_data=["CO2.value"],
                                title= " Spatial distribution or requested tracks", zoom=8,
                                hover_name="id")


    fig.update_layout(mapbox_style="open-street-map",
                          margin={"r": 5, "t": 50, "l": 10, "b": 5})
    fig.show()
        

def plot_scatter(df, column1, column2, alpha=0.2):
    relation = df[['track.id',column1, column2]]
    relation.plot(kind='scatter', x = column1, y = column2, alpha=alpha )
    
    
    
def plot_normality_with_qqplot(point_df, column):
    '''
        Aim: 
            create q-q plot to inspect normality of distribution of selected variable

    Keyword Arguments: 
        df {Geodataframe} -- points input
        column {str} -- variable name

        Output: Q-Q plot
    '''
    plot = stats.probplot(point_df[column],  dist="norm", plot=plt, fit = False)
    plt.title(column)
    plt.show()
    
    

def plot_hist(df, column=''):
    if column !='':
        x = df[column]
    else:
        x = df
    sns.distplot(x)
    
    
def plot_linear_regression(variableName1, variableName2, title=''):
    sns.regplot(x=variableName1, y=variableName2).set_title(title)
    
    
def plot_distribution_s(points_df, column, column_gps = None):
    """ 
    Aim:
        Plot of two distributions in a single figure for visually comparing the shapes of the two distributions
    
    Keyword Arguments: 
        points {GeoDataFrame} -- the GeoDataFrame containing the measurements
        Column {str} -- the column name of measurement of interest,e.g. 'Speed.value'
        Column {str} -- the column name of measurement of same phenomena but measured based on GPS, e.g. 'GPS speed.value'
        
    Return:
        No Return, instead a plot is displayed
    """
    if column_gps is not None:
        sns.kdeplot(points_df[column], shade=True)
        sns.kdeplot(points_df[column_gps], shade=True)
    else:
        sns.kdeplot(points_df[column], shade=True)
    

def st_cube_simple(points):
    """ To plot a space-time cube of one trajectory. Checks for the start time
        and calculates seconds passed from it for every next point

    Keyword Arguments:
        points {dataframe} -- A Pandas dataframe of a trajectory
    Returns:
        No Return
    """

    def seconds_from_start(x, start):
        date_time_obj = datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%S')
        seconds = (date_time_obj-start).total_seconds()
        return int(seconds)

    points['lat'] = points['geometry'].apply(lambda coord: coord.y)
    points['lng'] = points['geometry'].apply(lambda coord: coord.x)
    start_time = datetime.datetime.strptime(
        points.time.iloc[0], '%Y-%m-%dT%H:%M:%S')

    points['time_seconds'] = np.vectorize(seconds_from_start)(
        np.array(points.time.values.tolist()), start_time)

    # plot the space-time cube
    fig = plt.figure()
    ax = fig.gca(projection='3d')
    ax.plot(points['lng'], points['lat'], points['time_seconds'])
    ax.set_xlabel('Longitude')
    ax.set_ylabel('Latitude')
    ax.set_zlabel('Seconds since start')
    fig.canvas.set_window_title('Space-Time Cube')
    plt.show()


def plot_pair_correlation(points_df, column_1, column_2,
                          sort_by='id', regression=False):
    """ To plot a pairwise relationship in a dataset.
    Special case for the Acceleration values to see difference
    (if any) between accelerating and braking.

    Keyword Arguments:
        points_df {dataframe} -- A Pandas dataframe of a trajectory
        column_1, column_2 {string} -- names of 2 columns to analyse
        sort_by {string} -- 'id' or 'temperature'
        regression {boolean} -- defines which kind of plot to plot
    Returns:
        No Return
    """

    if (sort_by == 'temperature'):
        bins = [-10, 0, 5, 10, 20, 30, 40]
        copied = points_df.copy()
        copied['Intake Temperature.value'] = \
            copied['Intake Temperature.value'].astype(int)
        copied['binned_temp'] = pd.cut(copied['Intake Temperature.value'],
                                       bins)

        if (column_2 == "Acceleration.value" or
                column_1 == "Acceleration.value"):
            df1 = copied[copied["Acceleration.value"] > 0]
            df2 = copied[copied["Acceleration.value"] < 0]

            if (regression):
                sns.lmplot(x=column_1, y=column_2, hue='binned_temp',
                           data=df1, palette="viridis")
                sns.lmplot(x=column_1, y=column_2, hue='binned_temp',
                           data=df2, palette="viridis")
            else:
                sns.pairplot(df1, vars=[column_1, column_2],
                             hue="binned_temp")
                sns.pairplot(df2, vars=[column_1, column_2],
                             hue="binned_temp")

        else:
            if (regression):
                sns.lmplot(x=column_1, y=column_2, hue='binned_temp',
                           data=copied)
            else:
                sns.pairplot(copied, vars=[column_1, column_2],
                             hue="binned_temp")

    else:
        if (column_2 == "Acceleration.value" or
                column_1 == "Acceleration.value"):
            df1 = points_df[points_df["Acceleration.value"] > 0]
            df2 = points_df[points_df["Acceleration.value"] < 0]

            if (regression):
                sns.lmplot(x=column_1, y=column_2, hue='track.id',
                           data=df1, palette="viridis")
                sns.lmplot(x=column_1, y=column_2, hue='track.id',
                           data=df2, palette="viridis")
            else:
                sns.pairplot(df1, vars=[column_1, column_2],
                             hue="track.id")
                sns.pairplot(df2, vars=[column_1, column_2],
                             hue="track.id")

        else:
            if (regression):
                sns.lmplot(x=column_1, y=column_2, hue='track.id',
                           data=points_df, palette="viridis")
            else:
                sns.pairplot(points_df, vars=[column_1, column_2],
                             hue="track.id")



def plot_distribution(points, column):
    fig, (ax1, ax2, ax3) = plt.subplots(
        1, 3, figsize=(15, 5), gridspec_kw={'width_ratios': [5, 5, 5]})

    sns.boxplot(x=points[column], ax=ax1)
    ax1.set_title('Boxplot')
    sns.kdeplot(points[column], shade=True, color="r", ax=ax2)
    ax2.set_title('Gaussian kernel density estimate')
    sns.distplot(points[column], kde=False, ax=ax3)
    ax3.set_title('Histogram')

    fig.tight_layout()
    plt.show()



def plot_region(region, region_map, region_color, label):
    """ To plot provided regions over the provided map

    Keyword Arguments:
        region {shapely Polygon} -- A shapely based Polygon
        region_map {folium map} -- Map over which trajectories are to be
            plotted
        region_color {string} -- Name of the Color in String
        label {String} -- Label for popup
    Returns:
        No Return
    """
    region_coords = []

    # to extract coordiantes from provided region
    index = 0
    for value in range(0, len(region.exterior.coords)):
        temp = []
        temp.append(region.exterior.coords[index][1])
        temp.append(region.exterior.coords[index][0])
        region_coords.append(temp)
        index += 1

    # to plot point's coordinates over the map as polygon
    region_plot = folium.Polygon(locations=region_coords,
                                 color=region_color, popup=label)
    region_map.add_child(region_plot)




def extract_barplot_info(day_length):
    """ To extract information for matplotlib plot

    Keyword Arguments:
        day_length {list} -- list with total length for each day
    Returns:
        day, height, highest, highest_index, average {strings/integers}
            -- attributes required for plots
    """
    day = []
    height = []
    highest = 0
    highest_index = -1
    total = 0

    index = 0
    for row in day_length:
        day.append(row[0][:3])  # extracting name of day of the week
        # in form of Mon, Tue etc.
        track_length = round(row[1], 2)  # extracting total length
        # associated with each day rounded to 2 decimals
        height.append(track_length)

        # extracting the highest value out of 'total lengths' from all
        # weekdays
        if(track_length > highest):
            highest = track_length
            highest_index = index

        total += track_length
        index += 1

    average_value = total/7  # extracting average value out of
    # 'total lengths' from all weekdays

    average = []
    for row in day:
        average.append(average_value)  # a list of same value at each
    # index, just to plot a horizontal line in plot

    return day, height, highest, highest_index, average


def spatioTemporalAggregation(df, field, summary, gridSize):
    """
    Aggregates the given field on hour and weekday basis.
    Prepares data for mosaic plot
    FOR THIS TO WORK YOU NEED TO INSTALL RTree or Rtree-linux!!!
    # TODO This function is poorly performing
    Parameters
    ----------
    df : geopandas dataframe
    field : string
        field to be summarized.
    summary : string
        type of summary to be sumarized. eg. min, max,sum, median
    gridSize : float
        the size of grid on same unit as geodataframe coordinates.

    Returns
    -------
    geodataframes: one each for larger grid and other for subgrids
        (for visualization purpose only)
        Aggregated grids with summary on it

    """
    def round_down(num, divisor):
        return floor(num / divisor) * divisor

    def round_up(num, divisor):
        return ceil(num / divisor) * divisor

    # Get crs from data
    sourceCRS = df.crs
    targetCRS = "epsg:3857"
    # Reproject to Mercator\
    df = df.to_crs(targetCRS)

    # Get bounds
    xmin, ymin, xmax, ymax = df.total_bounds
    height, width = gridSize, gridSize
    top, left = round_up(ymax, height), round_down(xmin, width)
    bottom, right = round_down(ymin, height), round_up(xmax, width)

    rows = int((top - bottom) / height)+1
    cols = int((right - left) / width)+1

    XleftOrigin = left
    XrightOrigin = left + width
    YtopOrigin = top
    YbottomOrigin = top - height
    polygons = []

    for i in range(cols):
        Ytop = YtopOrigin
        Ybottom = YbottomOrigin
        for j in range(rows):
            polygons.append(Polygon(
                [(XleftOrigin, Ytop), (XrightOrigin, Ytop),
                 (XrightOrigin, Ybottom), (XleftOrigin, Ybottom)]))
            Ytop = Ytop - height
            Ybottom = Ybottom - height
        XleftOrigin = XleftOrigin + width
        XrightOrigin = XrightOrigin + width

    grid = gpd.GeoDataFrame({'geometry': polygons})
    grid.crs = (targetCRS)

    # Assign gridid
    numGrid = len(grid)
    grid['gridId'] = list(range(numGrid))

    # Identify gridId for each point

    df['hour'] = df['time'].apply(
        lambda x: datetime.datetime.strptime(
            x, '%Y-%m-%dT%H:%M:%S+00:00')).dt.hour
    df['weekday'] = df['time'].apply(
        lambda x: datetime.datetime.strptime(
            x, '%Y-%m-%dT%H:%M:%S+00:00')).dt.dayofweek

    # df['hour'] = pd.to_datetime(df['time']).dt.hour
    # df['weekday'] = pd.to_datetime(df['time']).dt.dayofweek

    points_identified = gpd.sjoin(df, grid, op='within')

    # group points by gridid and calculate mean Easting,
    # store it as dataframe
    # delete if field already exists
    if field in grid.columns:
        del grid[field]

    # Aggregate by weekday, hour and grid
    grouped = points_identified.groupby(
        ['gridId', 'weekday', 'hour']).agg({field: [summary]})
    grouped = grouped.reset_index()
    grouped.columns = grouped.columns.map("_".join)
    modified_fieldname = field+"_"+summary

    # Create Subgrids
    subgrid, mainGrid, rowNum, columnNum, value = [], [], [], [], []
    unikGrid = grouped['gridId_'].unique()
    print('running; wait till you see "finished"')
    for currentGrid in unikGrid:
        dataframe = grid[grid['gridId'] == currentGrid]
        xmin, ymin, xmax, ymax = dataframe.total_bounds
        xminn, xmaxx, yminn, ymaxx = xmin + \
            (xmax-xmin)*0.05, xmax-(xmax-xmin)*0.05, ymin + \
            (ymax-ymin)*0.05, ymax-(ymax-ymin)*0.05
        rowOffset = (ymaxx-yminn)/24.0
        colOffset = (xmaxx - xminn)/7.0
        tmp = (grouped['gridId_'] == currentGrid)
        for i in range(7):
            tmp2=(grouped['weekday_'] == i)
            for j in range(24):
                topy, bottomy, leftx, rightx = ymaxx-j*rowOffset, ymaxx - \
                    (j+1)*rowOffset, xminn+i * \
                    colOffset, xminn+(i+1)*colOffset
                subgrid.append(
                    Polygon([(leftx, topy), (rightx, topy),
                             (rightx, bottomy), (leftx, bottomy)]))
                mainGrid.append(currentGrid)
                rowNum.append(j)
                columnNum.append(i)
                if len(grouped[tmp
                       & tmp2
                       & (grouped['hour_'] == j)]) != 0:
                    this_value = grouped[
                        tmp
                        & tmp2
                        & (grouped['hour_'] == j)].iloc[0][
                            modified_fieldname]
                    value.append(this_value)
                else:
                    value.append(np.nan)
    subgrid_gpd = gpd.GeoDataFrame({'geometry': subgrid})
    subgrid_gpd.crs = targetCRS
    # Reproject to Mercator\
    subgrid_gpd = subgrid_gpd.to_crs(sourceCRS)
    subgrid_gpd['gridId'] = mainGrid
    subgrid_gpd['Weekday'] = columnNum
    subgrid_gpd['hour'] = rowNum
    subgrid_gpd['gridId'] = subgrid_gpd.apply(lambda x: str(
        x['gridId'])+"_"+str(x['Weekday'])+"_"+str(x['hour']), axis=1)
    subgrid_gpd[modified_fieldname] = value
    subgrid_gpd = subgrid_gpd.dropna()
    grid = grid.to_crs(sourceCRS)
    grid = grid[grid['gridId'].isin(unikGrid)]
    print('finished')
    return grid, subgrid_gpd
    # final_subgrid=subgrid_gpd[subgrid_gpd['value'].notnull()]
    # return final_subgrid

#############################################################################################################################
def MosaicPlot(mainGrid, grid, field):
    """
    Performs spatio temporal aggregation of data on weekday and hour,
        and prepares mosaicplot.

    Parameters
    ----------
    mainGrid :polygon geodataframe
        The grid geodataframe with grid and aggregated data in a column.
        Grid shoud have grid id or equivalent unique ids
    grid: Small subgrids, prepared for visualization purpose
    only represents an hour of a weekday
    field : string
        Fieldname with aggregated data

    Returns
    -------
    m : folium map object
        Folium map with openstreetmap as base.

    """
    # Prepare for grid plotting using folium
    grid.columns = [cols.replace('.', '_') for cols in grid.columns]
    field = field.replace('.', '_')
    # Convert grid id to string
    grid['gridId'] = grid['gridId'].astype(str)

    # Convert maingrid,subgrid to geojson and csv
    mainGrid.to_file("mainGrids.geojson", driver='GeoJSON')
    atts = pd.DataFrame(grid)
    grid.to_file("grids.geojson", driver='GeoJSON')
    atts.to_csv("attributes.csv", index=False)

    # load spatial and non-spatial data
    data_geojson_source = "grids.geojson"
    # data_geojson=gpd.read_file(data_geojson_source)
    data_geojson = json.load(open(data_geojson_source))

    # load spatial and non-spatial data
    grid_geojson_source = "mainGrids.geojson"
    mainGrid_geojson = json.load(open(grid_geojson_source))

    # Get coordiantes for map centre
    lat = grid.geometry.centroid.y.mean()
    lon = grid.geometry.centroid.x.mean()

    # Intialize a new folium map object
    m = folium.Map(location=[lat, lon],
                   zoom_start=10, tiles='Stamen Toner')

    # Configure geojson layer
    # style = {'fillColor': '#f5f5f5', 'lineColor': '#ffffbf'}
    # polygon = folium.GeoJson(gjson, style_function = \
    # lambda x: style).add_to(m)
    # def style_function():
    # return {'fillColor': '#00FFFFFF', 'lineColor': '#00FFFFFF'}
    # folium.GeoJson(data_geojson).add_to(m)
    folium.GeoJson(mainGrid_geojson,
                   lambda feature: {'lineOpacity': 0.4,
                                    'color': '#00ddbb',
                                    'fillColor': None,
                                    'weight': 2,
                                    'fillOpacity': 0}).add_to(m)

    # add attribute data
    attribute_pd = pd.read_csv("attributes.csv")
    attribute = pd.DataFrame(attribute_pd)
    # Convert gridId to string to ensure it matches with gridId
    attribute['gridId'] = attribute['gridId'].astype(str)

    # construct color map
    minvalue = attribute[field].min()
    maxvalue = attribute[field].max()
    colormap_rn = linear.YlOrRd_09.scale(minvalue, maxvalue)

    # Create Dictionary for colormap
    population_dict_rn = attribute.set_index('gridId')[field]

    # create map
    folium.GeoJson(
        data_geojson,
        name='Choropleth map',
        style_function=lambda feature: {
            'lineOpacity': 0,
            'color': 'green',
            'fillColor': colormap_rn(population_dict_rn[
                feature['properties']['gridId']]),
            'weight': 0,
            'fillOpacity': 0.9
        },
        highlight_function=lambda feature: {
            'weight': 3, 'color': 'black', 'fillOpacity': 1},
        tooltip=folium.features.GeoJsonTooltip(fields=['Weekday', 'hour',
                                                       field])).add_to(m)

    # format legend
    field = field.replace("_", " ")
    # add a legend
    colormap_rn.caption = '{value} per grid by weekday and hour'.format(
        value=field)
    colormap_rn.add_to(m)

    # add a layer control
    folium.LayerControl().add_to(m)
    return m
    # Aggregate data by weekday and hour




def aggregateByGrid(df, field, summary, gridSize):
    """
    Aggregates the specified field with chosen summary type and user
        defined grid size. returns aggregated grids with summary

    Parameters
    ----------
    df : geopandas dataframe
    field : string
        field to be summarized.
    summary : string
        type of summary to be sumarized. eg. min, max,sum, median
    gridSize : float
        the size of grid on same unit as geodataframe coordinates.

    Returns
    -------
    geodataframe
        Aggregated grids with summary on it

    """
    def round_down(num, divisor):
        return floor(num / divisor) * divisor

    def round_up(num, divisor):
        return ceil(num / divisor) * divisor

    # Get crs from data
    sourceCRS = df.crs
    targetCRS = "EPSG:3857"
    # Reproject to Mercator\
    df = df.to_crs(targetCRS)
    # Get bounds
    xmin, ymin, xmax, ymax = df.total_bounds
    print(xmin, ymin, xmax, ymax)
    height, width = gridSize, gridSize
    top, left = round_up(ymax, height), round_down(xmin, width)
    bottom, right = round_down(ymin, height), round_up(xmax, width)

    rows = int((top - bottom) / height)+1
    cols = int((right - left) / width)+1

    XleftOrigin = left
    XrightOrigin = left + width
    YtopOrigin = top
    YbottomOrigin = top - height
    polygons = []
    for i in range(cols):
        Ytop = YtopOrigin
        Ybottom = YbottomOrigin
        for j in range(rows):
            polygons.append(Polygon([(XleftOrigin, Ytop),
                                     (XrightOrigin, Ytop),
                                     (XrightOrigin, Ybottom),
                                     (XleftOrigin, Ybottom)]))
            Ytop = Ytop - height
            Ybottom = Ybottom - height
        XleftOrigin = XleftOrigin + width
        XrightOrigin = XrightOrigin + width

    grid = gpd.GeoDataFrame({'geometry': polygons})
    grid.crs = df.crs

    # Assign gridid
    numGrid = len(grid)
    grid['gridId'] = list(range(numGrid))

    # Identify gridId for each point
    points_identified = gpd.sjoin(df, grid, op='within')

    # group points by gridid and calculate mean Easting,
    # store it as dataframe
    # delete if field already exists
    if field in grid.columns:
        del grid[field]
    grouped = points_identified.groupby('gridId')[field].agg(summary)
    grouped_df = pd.DataFrame(grouped)

    new_grid = grid.join(grouped_df, on='gridId').fillna(0)
    grid = new_grid.to_crs(sourceCRS)
    summarized_field = summary+"_"+field
    final_grid = grid.rename(columns={field: summarized_field})
    final_grid = final_grid[final_grid[summarized_field] > 0].sort_values(
        by=summarized_field, ascending=False)
    final_grid[summarized_field] = round(final_grid[summarized_field], 1)
    final_grid['x_centroid'], final_grid['y_centroid'] = \
        final_grid.geometry.centroid.x, final_grid.geometry.centroid.y
    return final_grid



def aggregateHourly(df, field, summary):
    """
    Aggregates the whole data by weekday and hour as preparation step for
        mosaic plot

    Parameters
    ----------
    df : GeoDataFrame
        The dataset of points to be summarized
    field : STRING
        The field in input dataframe to be summarized
    summary : String
        The type of aggregation to be used.eg. mean, median,

    Returns
    -------
    dayhourAggregate : dataframe
        Aggregated Data by weekday and time

    """
    # extract date and time from timestamp
    df['hour'] = df['time'].apply(
        lambda x: datetime.datetime.strptime(
            x, '%Y-%m-%dT%H:%M:%S+00:00')).dt.hour
    df['weekday'] = df['time'].apply(
        lambda x: datetime.datetime.strptime(
            x, '%Y-%m-%dT%H:%M:%S+00:00')).dt.dayofweek

    # df['hour'] = pd.to_datetime(df['time']).dt.hour
    # df['weekday'] = pd.to_datetime(df['time']).dt.dayofweek

    # Aggregate by weekday and hour
    dayhourAggregate = df.groupby(
        ['weekday', 'hour']).agg({field: [summary]})
    dayhourAggregate = dayhourAggregate.reset_index()
    dayhourAggregate.columns = dayhourAggregate.columns.map("_".join)
    return dayhourAggregate

def OriginAndDestination(df):
    """
    Return dataframe for origin and destinations for tracks
        by their trackid

    Parameters
    ----------
    df : TYPE
        DESCRIPTION.

    Returns
    -------
    origin : TYPE
        DESCRIPTION.
    destination : TYPE
        DESCRIPTION.

    """
    track_list = list(df['track.id'].unique())
    origin, destination = gpd.GeoDataFrame(), gpd.GeoDataFrame()
    for track in track_list:
        selected_tracks = df[df['track.id'] == track]
        current_origin = selected_tracks[selected_tracks['time']
                                         == selected_tracks['time'].min()]
        current_destination = selected_tracks[selected_tracks['time']
                                              == selected_tracks[
                                                  'time'].max()]
        origin = origin.append(current_origin)
        destination = destination.append(current_destination)
    return origin, destination

def plotAggregate(grid, field):
    """
    Plots the aggregated data on grid. Please call aggregateByGrid
        function before this step.

    Parameters
    ----------
    grid :polygon geodataframe
        The grid geodataframe with grid and aggregated data in a column.
        Grid shoud have grid id or equivalent unique ids
    field : string
        Fieldname with aggregated data

    Returns
    -------
    m : folium map object
        Folium map with openstreetmap as base.

    """
    # Prepare for grid plotting using folium
    grid.columns = [cols.replace('.', '_') for cols in grid.columns]
    field = field.replace('.', '_')
    # Convert grid id to string
    grid['gridId'] = grid['gridId'].astype(str)

    # Convert data to geojson and csv
    atts = pd.DataFrame(grid)
    grid.to_file("grids.geojson", driver='GeoJSON')
    atts.to_csv("attributes.csv", index=False)

    # load spatial and non-spatial data
    data_geojson_source = "grids.geojson"
    # data_geojson=gpd.read_file(data_geojson_source)
    data_geojson = json.load(open(data_geojson_source))

    # Get coordiantes for map centre
    lat = grid.geometry.centroid.y.mean()
    lon = grid.geometry.centroid.x.mean()
    # Intialize a new folium map object
    m = folium.Map(location=[lat, lon], zoom_start=10,
                   tiles='OpenStreetMap')

    # Configure geojson layer
    folium.GeoJson(data_geojson,
                   lambda feature: {'lineOpacity': 0.4,
                                    'color': 'black',
                                    'fillColor': None,
                                    'weight': 0.5,
                                    'fillOpacity': 0}).add_to(m)

    # add attribute data
    attribute_pd = pd.read_csv("attributes.csv")
    attribute = pd.DataFrame(attribute_pd)
    # Convert gridId to string to ensure it matches with gridId
    attribute['gridId'] = attribute['gridId'].astype(str)

    # construct color map
    minvalue = attribute[field].min()
    maxvalue = attribute[field].max()
    colormap_rn = linear.YlOrRd_09.scale(minvalue, maxvalue)

    # Create Dictionary for colormap
    population_dict_rn = attribute.set_index('gridId')[field]

    # create map
    folium.GeoJson(
        data_geojson,
        name='Choropleth map',
        style_function=lambda feature: {
            'lineOpacity': 0,
            'color': 'green',
            'fillColor': colormap_rn(
                population_dict_rn[feature['properties']['gridId']]),
            'weight': 0,
            'fillOpacity': 0.6
        },
        highlight_function=lambda feature: {'weight': 3, 'color': 'black',
                                            'fillOpacity': 1},
        tooltip=folium.features.GeoJsonTooltip(fields=[field],
                                               aliases=[field])
    ).add_to(m)

    # format legend
    field = field.replace("_", " ")
    # add a legend
    colormap_rn.caption = '{value} per grid'.format(value=field)
    colormap_rn.add_to(m)

    # add a layer control
    folium.LayerControl().add_to(m)
    return m


def getClusters(positions, distanceKM, min_samples=5):
    """
    Returns the clusters from the points based on provided data to no. of
        clusters based on DBScan Algorithm

    Parameters
    ----------
    positions : Geodataframe object
       Geodataframe with positions to be clustered
    distanceKM : Float
        Epsilon parameters fo dbscan algorithm in km. or, distance for
            clustering of points
    min_samples : Integer, optional
        DESCRIPTION. Minimum no. of points required to form cluster.
            If 1 is set,each individual will form their own cluster
            The default is 5.

    Returns
    -------
    Dataframe
        The dataframe with cluster centres co-ordinates and no. of points
            on the cluster.

    """
    def get_centermost_point(cluster):
        centroid = (MultiPoint(cluster).centroid.x,
                    MultiPoint(cluster).centroid.y)
        centermost_point = min(
            cluster, key=lambda point: great_circle(point, centroid).m)
        return tuple(centermost_point)
    df = positions.to_crs('epsg:4326')
    lon = df.geometry.x
    lat = df.geometry.y
    origin_pt = pd.DataFrame()
    # Populate lat lon to dataframe
    origin_pt['lat'] = lat
    origin_pt['lon'] = lon
    # add index to data
    coords = origin_pt.to_numpy()
    origin_pt.index = [i for i in range(len(lat))]
    #
    # Convert Data to projected and perform clustering
    kms_per_radian = 6371.0088
    epsilon = distanceKM / kms_per_radian
    db = DBSCAN(eps=epsilon, min_samples=min_samples,
                algorithm='ball_tree', metric='haversine').fit(
                    np.radians(coords))
    cluster_labels = db.labels_
    validClusters = []
    for cluster in cluster_labels:
        if cluster != -1:
            validClusters.append(cluster)
    num_clusters = len(set(validClusters))
    clusters = pd.Series([coords[cluster_labels == n]
                          for n in range(num_clusters)])
    # Assigining clusterId to each point
    origin_pt['clusterId'] = cluster_labels
    # Identify cluster Centres
    centermost_points = clusters.map(get_centermost_point)

    # Create Geodataframe with attributes for cluster centroids
    clusterId = [i for i in range(len(centermost_points))]
    centroidLat = [centermost_points[i][0]
                   for i in range(len(centermost_points))]
    centroidLon = [centermost_points[i][1]
                   for i in range(len(centermost_points))]
    clusterSize = [len(origin_pt[origin_pt['clusterId'] == i])
                   for i in range(len(centermost_points))]
    # Create dataframe for cluster centers
    clusterCentres_df = pd.DataFrame(
        {'clusterId': clusterId, 'clusterLat': centroidLat,
         'clusterLon': centroidLon, 'clusterSize': clusterSize})
    clusterCentres = gpd.GeoDataFrame(clusterCentres_df,
                                      geometry=gpd.points_from_xy(
                                          clusterCentres_df.clusterLon,
                                          clusterCentres_df.clusterLat))
    return clusterCentres

def showClusters(clusterCentres, track):
    """
    Shows the cluster of the datasets along with original tracks

    Parameters
    ----------
    clusterCentres : Geodataframe
        The geodataframe object with details of clusterCenters.
        Obtained as processing by getClusters fucntion
    track : Geodataframe
        The points geodataframe to be shown on map alongwith clusters.
        For visualization only

    Returns
    -------
    m : folium map-type object
        The map with source data and clusters overlaid

    """
    # Make an empty map
    lat = clusterCentres.geometry.y.mean()
    lon = clusterCentres.geometry.x.mean()
    clusterList = list(clusterCentres['clusterSize'])
    m = folium.Map(location=[lat, lon],
                   tiles="openstreetmap", zoom_start=12)

    # add points from track
    for i in range(0, len(track)):
        lat = track.iloc[i].geometry.y
        lon = track.iloc[i].geometry.x
        folium.Circle(
            location=[lat, lon],
            radius=0.05,
            color='black',
            weight=2,
            fill=True, opacity=0.5,
            fill_color='black',
        ).add_to(m)

        # add marker one by one on the map
    for i in range(0, len(clusterCentres)):
        folium.Circle(
            location=[clusterCentres.iloc[i]['clusterLat'],
                      clusterCentres.iloc[i]['clusterLon']],
            popup=clusterList[i],
            radius=clusterList[i]*10,
            color='red',
            weight=2,
            fill=True,
            fill_color='red'
        ).add_to(m)
    return m
