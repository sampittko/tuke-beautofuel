import pandas as pd
import numpy as np
import time
import datetime

import geopandas as gpd

# class Correction():
#     def __init__(self):
#         print("Initializing class 'Correction'")



def track_duration_time(df):
    '''
         Aim:
            Create a time object in DF which holds the duration of a track in format hh:mm:ss
         Input:
             Geopandas Dataframe,
         Output:
             Geopandas Dataframe with column 'track_duration_h'
     '''
    def timedeltaToTime(sec):
        '''
            Aim:
                Convert timedelta in seconds to string in UTC
            Input:
                seconds as float
            Output:
              UTC string
        '''

        timeUTC = time.gmtime(sec) # converting seconds to a struct.time in UTC
        timeString = time.strftime("%H:%M:%S",timeUTC)
        return timeString

    # Create time objects from string objects
    df['time_track_begin'] = pd.to_datetime(df['track.begin'])
    df['time_track_end'] = pd.to_datetime(df['track.end'])

    # Create a column with timedelta as total seconds as a float type
    df['track_duration_seconds'] = (df['time_track_end']-df['time_track_begin']) / pd.Timedelta(seconds=1)
    
    # Create time string (hh:mm:ss) from timedelta
    df['track_duration_h'] = df['track_duration_seconds'].apply(lambda x: timedeltaToTime(x))

    # Create time object from timedelta string
    df['track_duration_h']= pd.to_datetime(df['track_duration_h'], format= '%H:%M:%S').dt.time

    # Drop colum with track duration in total seconds
    df = df.drop(['track_duration_seconds'], axis=1)
    
    return df


def exceed_eight_hours(df, flag=True):
    '''
        Aim:
            Check if there are tracks with a duration > 8 h 
            Delete tracks with duration > 8h
            Optional: Flag all timestamps of tracks with duration > 8h
        Input:
            Geopandas Dataframe,
        Output:
            Geopandas DF with added column which flags all time stamps belonging to a track which falls below 5 min time duration
            Geopandas DF containing only tracks which do not exceed duration of 8 hours,
            Pandas DF which contains two columns, track.id and track_duration_h
    '''

    # Create DF from grouped tracks and their time duration if not already in DF
    if 'track_duration_h' not in df.columns:
        df = track_duration_time(df)

    # Create DF from grouped tracks which holds only two columns, track.id and track_duration_h
    track_lengths = df.groupby('track.id')['track_duration_h'].first().to_frame().reset_index()

    # Create a list from tracks which duration exceeds eight hours
    track_lengths['exceedingEightHours'] = 0
    track_lengths.loc[track_lengths['track_duration_h'] >= datetime.time(8, 0, 0), 'exceedingEightHours'] = track_lengths['track.id']
    listExceedEightHours = [row for row in track_lengths['exceedingEightHours'] if row != 0]

    if len(listExceedEightHours) == 0:
        cleanDF = df
        # For return, create empty DF
        df_eight = pd.DataFrame({'track.id': [], 'track_duration_h': []})
        print('no track duration exceeds eight hours')
    else:
        # For return, create DF from all tracks which duration exceeds eight hours
        print(len(listExceedEightHours), 'tracks are longer than eight hours')
        df_eight = track_lengths[track_lengths['track.id'].isin(listExceedEightHours)]
        df_eight = df_eight[['track.id', 'track_duration_h']]

        # For return, create complete DF with tracks which time duration is shorter than 8 hours
        track_lengths['underEightHours'] = 0
        track_lengths.loc[track_lengths['track_duration_h'] < datetime.time(8, 0, 0), 'underEightHours'] = track_lengths['track.id']
        listUnderEightHours = [row for row in track_lengths['underEightHours'] if row != 0]
        cleanDF = pd.DataFrame(df[df['track.id'].isin(listUnderEightHours)])

    # To flag implausible values in original df, add column which holds boolean value, 1 = track_duration > 8 hours
    if flag == True:
        df['track_exceeds_8h'] = 0
        df.loc[df['track_duration_h'] > datetime.time(8, 0, 0), 'track_exceeds_8h'] = 1

    return df, cleanDF, df_eight


def below_five_min(df, flag=True):
    '''
        Aim:
            Check if there are tracks with a duration < 5 min
            Delete tracks with duration < 5 min
            Optional: Flag all timestamps of tracks with duration < 5 min
        Input:
            Geopandas Dataframe,
        Output:
            Geopandas DF with added column which flags all time stamps belonging to tracks falling below 5 min time duration with 1
            Geopandas DF containing only tracks which are longer than 5 min
            Pandas DF which contains two columns, track.id and track_duration_h
    '''

    # Add time column
    if 'track_duration_h' not in df.columns:
        df = track_duration_time(df)

    # From grouped tracks create DF which holds two columns only, track.id and track_duration_h
    track_lengths = df.groupby('track.id')['track_duration_h'].first().to_frame().reset_index()

    # Create a list from tracks which duration < 5 min
    track_lengths['belowFiveMin'] = 0
    track_lengths.loc[track_lengths['track_duration_h'] <= datetime.time(0, 5, 0), 'belowFiveMin'] = track_lengths['track.id']
    listBelowFiveMin = [row for row in track_lengths['belowFiveMin'] if row != 0]

    if len(listBelowFiveMin) == 0:
        cleanDF = df
        # For return, create empty DF
        df_five = pd.DataFrame({'track.id': [], 'track_duration_h': []})
        print('no track duration falls below 5 minutes')
    else:
        # For return, create DF from all tracks which duration falls below 5 min
        print(len(listBelowFiveMin), 'tracks are shorter than 5 minutes')
        df_five = track_lengths[track_lengths['track.id'].isin(listBelowFiveMin)]
        df_five = df_five[['track.id', 'track_duration_h']]

        # For return, create complete DF with tracks which time duration is longer than 5 minutes
        track_lengths['overFiveMin'] = 0
        track_lengths.loc[track_lengths['track_duration_h'] > datetime.time(0, 5, 0), 'overFiveMin'] = track_lengths['track.id']
        listOverFiveMin = [row for row in track_lengths['overFiveMin'] if row != 0]
        cleanDF = pd.DataFrame(df[df['track.id'].isin(listOverFiveMin)])

    # To flag implausible values in original df, add column which holds boolean value, 1 = track_duration < 5 min
    if flag == True:
        df['track_below_5min'] = 0
        df.loc[df['track_duration_h'] < datetime.time(0, 5, 0), 'track_below_5min'] = 1

    return df, cleanDF, df_five




def implausible_Max_Speed(df, flag=True):
    '''
        Aim:
            Check if there are tracks with speeds > 250km/h
            Delete tracks with speeds > 250km/h
            Optional: Flag timestamps with speeds above 250km/h
        Input:
            Geopandas Dataframe,
            optional: Boolean variable 'flag'
        Output:
            Input Geopandas Dataframe with added flag column if parameter 'flag' set to True,
            Geopandas Dataframe containing only tracks which do not exceed max speed of  250km/h,
            Pandas Dataframe which contains two columns, track.id and track_max_speed
    '''

    # Create DF from grouped tracks and their max speed value
    track_lengths = df.groupby('track.id')['Speed.value'].max().to_frame(name='track_max_speed').reset_index()

    # Create list and DF with tracks which max speed exceeds 250km/h
    track_lengths['exceeds250km'] = 0
    track_lengths.loc[track_lengths['track_max_speed'] >= 250, 'exceeds250km'] = track_lengths['track.id']
    listExceeding250 = [row for row in track_lengths['exceeds250km'] if row != 0]

    if len(listExceeding250) == 0:
        print('no track exceeds max speed 250km/h')
        cleanDF = df
        # Create empty DF for return
        df_250 = pd.DataFrame({'track.id': [], 'track_max_speed': []})
    else:
        print(len(listExceeding250), 'tracks exceed max speed 250')
        df_250 = track_lengths[track_lengths['track.id'].isin(listExceeding250)]
        df_250 = df_250[['track.id', 'track_max_speed']]
        # Create list and DF with tracks which max speed is below 250km
        track_lengths['speedUnder250km_h'] = 0
        track_lengths.loc[track_lengths['track_max_speed'] < 250, 'speedUnder250km_h'] = track_lengths['track.id']
        listUnder250 = [row for row in track_lengths['speedUnder250km_h'] if row != 0]
        cleanDF = pd.DataFrame(df[df['track.id'].isin(listUnder250)])

    # To flag implausible values, add column which holds boolean value, 1 = speed > 250
    if flag == True:
        df['speedExceeds250km_h'] = 0
        df.loc[df['Speed.value'] > 250, 'speedExceeds250km_h'] = 1

    return df, cleanDF, df_250


def flag_faulty_percentages(df, setValueToNan=True, dropColumns=True, dropFlag=False):
    '''
        Aim: 
            Inspect if there are faulty percentages (percentages below 0 and above 100)

        Input: 
            Geodataframa

        Output: 
            Geodataframe with added column which contains when percentages are faulty
    '''
    df["faulty_percentages"] = 0
    units = df.filter(like='.unit').columns
    values = df.filter(like='.value').columns

    listNames =[]
    for col in units:
        if df[col].iloc[0]== '%':
            name = col.split(".")[0] + '.value'
            listNames.append(name)

    for variable in listNames:
        variableName = 'faulty_percentages_' + variable
        df[variableName] = 0
        df.loc[df[variable] < 0, 'faulty_percentages'] = 1
        df.loc[df[variable] > 100, 'faulty_percentages'] = 1
        df.loc[df[variable] < 0, variableName] = 1
        df.loc[df[variable] > 100, variableName] = 1
        faultyPercentagesV = (df[variableName].values == 1).sum()
        print(variableName, faultyPercentagesV)

        if setValueToNan == True:
            df.loc[df[variable] < 0, variable] = np.nan
            df.loc[df[variable] > 100, variable] = np.nan
        #df[variable +'_corrected' ] = df[variable].interpolate(method ='linear', limit_direction ='both')
        #print(variable, df[variable].isna().sum())
        
        if dropColumns == True:
            df.drop([variableName], axis=1, inplace=True)
        
    faultyPercentages = (df['faulty_percentages'].values == 1).sum()
    print('Flagged faulty percentages: ', faultyPercentages)
    if dropFlag == True:
        df.drop(['faulty_percentages'], axis=1, inplace=True)
    
    return df


def flag_implausible_negative_values(df, setToNan=False, dropFlag=False):
    '''
        Aim: Inspect if there are unexpected negative values

        Input: Geodataframa

        Output: Geodataframe with added column which contains 1 when values are negative
    '''   
    
    listNonNegative=['Speed.value', 
                     'CO2.value',
                     'Rpm.value',
                     'Consumption (GPS-based).value',
                     'Consumption.value',
                     'CO2 Emission (GPS-based).value']

    
    df["implausible_neg_value"] = 0
    for variable in listNonNegative:
        df.loc[df[variable] < 0, 'implausible_neg_value'] = 1
        if setToNan == True:
            df.loc[df[variable] < 0, variable] = np.nan
        
    implausibleNegativeValues = (df['implausible_neg_value'].values == 1).sum()
    print('Flagged implausible negative values: ', implausibleNegativeValues)
    if dropFlag == True:
        df.drop(['implausible_neg_value'], axis=1, inplace=True)
    return df


def drop_dublicates(complete_track_df, keep='last'):
    beforeDel=complete_track_df.shape[0]
    complete_track_df.drop_duplicates(subset=['geometry', 'Engine Load.value', 'Calculated MAF.value',
           'Speed.value', 'CO2.value', 'Intake Pressure.value', 'Rpm.value',
           'Intake Temperature.value', 'Consumption (GPS-based).value',
           'GPS Altitude.value', 'Throttle Position.value', 'GPS Bearing.value',
           'Consumption.value', 'GPS Accuracy.value',
           'CO2 Emission (GPS-based).value', 'GPS Speed.value', 
           'track.length', 'track.begin', 'track.end', 'sensor.type',
           'sensor.engineDisplacement', 'sensor.model', 'sensor.id',
           'sensor.fuelType', 'sensor.constructionYear', 'sensor.manufacturer'],keep='last', inplace=True)
    afterDel=complete_track_df.shape[0]
    deleted=beforeDel-afterDel
    print('Deleted rows: ', deleted)
    return complete_track_df


def flag_outlier_in_sample(df, dropOutlierColumn=False, setOutlierToNan=False, dropFlag=False):
    '''
        Aim: Find outlier with regard to the sample's distribution 

        Input: Geodataframa

        Output: Geodataframe with added column which values are '1' 
                        when a certain value of a variable in the list is considered to 
                        be an outlier regarding the samples's distribution
    '''
    ls = df.select_dtypes(['float64']).columns.to_list()
    
    df['outlier_in_sample'] = 0
    for variable in ls:
        variableName='outlier_in_sample_'+ variable
        df[variableName] = 0
        Q1 = df[variable].quantile(0.10)
        Q3 = df[variable].quantile(0.90)
        IQR = Q3 - Q1
        low_lim = Q1 - 1.5 * IQR 
        up_lim = Q3 + 1.5 * IQR  
        df.loc[df[variable] < low_lim, variableName] = 1
        df.loc[df[variable] > up_lim, variableName] = 1
        df.loc[df[variable] < low_lim, 'outlier_in_sample'] = 1
        df.loc[df[variable] > up_lim, 'outlier_in_sample'] = 1
        print(variableName, (df[variableName].values == 1).sum())

        if setOutlierToNan == True:
            df.loc[df[variableName] == 1 , variable] = np.nan

        if dropOutlierColumn == True:
            df.drop([variableName], axis=1, inplace=True)

    outlier = (df['outlier_in_sample'].values == 1).sum()
    print('Flagged outlier in sample: ', outlier)
    
    if dropFlag==True:
        df.drop(['outlier_in_sample'], axis=1, inplace=True)
        
    return df


def remove_outliers(points, column):
    """ Remove outliers by using the statistical approach
    as described in
    https://www.itl.nist.gov/div898/handbook/prc/section1/prc16.htm

    Keyword Arguments:
        points {GeoDataFrame} -- A GeoDataFrame containing the track points
        column {String} -- Columnn name to remove outliers from

    Returns:
        new_points -- Points with outliers removed
    """

    if (column == "Acceleration.value"):
        # trying to keep outliers while removing unrealistic values
        new_points = points.loc[(points[column] > -20) & (
            points[column] < 20)]
    else:
        # broader range with 0.01 and 0.99
        first_quartile = points[column].quantile(0.10)
        third_quartile = points[column].quantile(0.90)
        iqr = third_quartile-first_quartile   # Interquartile range
        fence_low = first_quartile - 1.5 * iqr
        fence_high = third_quartile + 1.5 * iqr

        new_points = points.loc[(points[column] > fence_low) & (
            points[column] < fence_high)]
    print('Removed outliers: ', points.shape[0]-new_points.shape[0])
    return new_points


def flag_outlier_in_track(df, dropLimits=True, dropOutlierColumn=True, setOutlierToNan=False, dropFlag=False):
    
    def low_limit(x):
            q1 = x.quantile(0.10)
            q3 = x.quantile(0.90)
            iqr = q3 - q1
            lower_limit = q1 - 1.5 * iqr
            return lower_limit

    def upper_limit(x):
            q1 = x.quantile(0.10)
            q3 = x.quantile(0.90)
            iqr = q3 - q1
            upper_limit = q3 + 1.5 * iqr
            return upper_limit
        
    ls = df.select_dtypes(['float64']).columns.to_list()
    df['outlier_in_track_all'] = 0
    for variable in ls:
            lowName = 'track_lowerLimit_' + variable
            upName = 'track_upperLimit_' + variable
            df_1 = df.groupby(['track.id'])
            df[lowName] = df_1[variable].transform(low_limit)
            df[upName] = df_1[variable].transform(upper_limit)
            df.loc[df[upName] < df[variable], "outlier_in_track_all"] = 1 
            df.loc[df[lowName] > df[variable], "outlier_in_track_all"] = 1 
            variableName='outlier_in_track_'+ variable
            df[variableName] = 0
            df.loc[df[upName] < df[variable], variableName] = 1 
            df.loc[df[lowName] > df[variable], variableName] = 1
            print(variableName, (df[variableName].values == 1).sum())

            if setOutlierToNan == True:
                df.loc[df[variableName] == 1 , variable] = np.nan

            if dropLimits == True:
                df.drop([upName, lowName], axis=1, inplace=True)

            if dropOutlierColumn == True:
                df.drop([variableName], axis=1, inplace=True)

    outlier = (df['outlier_in_track_all'].values == 1).sum()
    print('Rows which contain outliers in tracks  (there may be multiple outlier in a single row) : ',outlier)
    
    if dropFlag == True:
        df.drop(['outlier_in_track_all'], axis=1, inplace=True)
    return df
