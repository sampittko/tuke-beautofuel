from datetime import datetime
import numpy as np


def get_interval_time(time1, time2):
    """ Calculate time difference in seconds between two points in time

    Parameters
    ----------
    time1: str
    time2: str
    Expected format is 2020-07-10T07:14:51

    Returns
    -------
    dt: float
        absolute time difference in seconds
    """

    return abs(datetime.strptime(time1, '%Y-%m-%dT%H:%M:%S+00:00') -
               datetime.strptime(time2, '%Y-%m-%dT%H:%M:%S+00:00')).total_seconds()


def calc_efficiency(res, res_min, res_max, eff_min, eff_max):
    """ Estimate efficiency by linear interpolation

    Parameters
    ----------
    res: numpy array
        driving resistance
    res_min: float
        minimum driving resistance for interpolation
    res_max: float
        maximum driving resistance for interpolation
    eff_min: float
        minimum efficiency for interpolation
    eff_max: float
        maximum efficiency for interpolation

    Returns
    -------
    efficiency: numpy array
        interpolated efficiency
    """

    return np.interp(res, [res_min, res_max], [eff_min, eff_max])


def error_mean(consumption1, consumption2, dt):
    """ Calculate time-weighted mean error between tow consumption series

    Parameters
    ----------
    consumption1: numpy array
        consumption in l/h or kW
    consumption2: numpy array
        consumption in l/h or kW
    dt: numpy array
        time interval in seconds

    Returns
    -------
    mean error: float
        mean error in l/h or kW
    """
    return np.abs(np.sum(consumption1 * dt) / np.sum(dt) - np.sum(consumption2 * dt) / np.sum(dt))


def error_measure(consumption1, consumption2, dt):
    """ Calculate time-weighted measurement error between tow consumption series

    Parameters
    ----------
    consumption1: numpy array
        consumption in l/h or kW
    consumption2: numpy array
        consumption in l/h or kW
    dt: numpy array
        time interval in seconds

    Returns
    -------
    measurement error: float
        measurement error in l/h or kW
    """

    return np.sum(np.abs(consumption1 - consumption2) * dt) / np.sum(dt)


def error_100km(consumption1, consumption2, dt, speed):
    """ Calculate time-weighted mean error between tow consumption series

    Parameters
    ----------
    consumption1: numpy array
        consumption in l/h or kW
    consumption2: numpy array
        consumption in l/h or kW
    dt: numpy array
        time interval in seconds
    speed: numpy array
        speed in km/h

    Returns
    -------
    consumption error: float
         consumption error in litres or kWh per 100 km
    """

    return 100 * np.abs(np.sum(consumption1 * dt) - np.sum(consumption2 * dt)) / np.sum(speed * dt)
