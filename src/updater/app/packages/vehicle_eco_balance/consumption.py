import numpy as np
from .utils import calc_efficiency


class ConsumptionPhys:
    """ Physical (load-based) consumption model.
    It is based on "Stefan Pischinger und Ulrich Seiffert. Vieweg Handbuch Kraftfahrzeugtechnik. Springer, 2016." (page 62)

    Parameters
    ----------
    consumption_type: str
        'energy' or 'fuel'
    g¹: float
        gravitational acceleration in m/s² (default 9.81)
    rho_air²: float
        air mass density in kg/m³ (default 1.225)


    Attributes
    ----------
    consumption_type: str
        'energy' or 'fuel'
    consumption : numpy array
        consumption in l/h if consumption_type is 'fuel' and in kW if consumption_type is 'energy'
    power: numpy array
        power in kW
    driving_resistance: numpy array
        driving resistance in N
    efficiency: numpy array
        efficiency (dimensionless)
    g¹: float
        gravitational acceleration in m/s² (default 9.81)
    rho_air²: float
        air mass density in kg/m³ (default 1.225)

    References for default values:
    ¹ Martin Treiber and Arne Kesting. “Traffic flow dynamics.” In: Traffic Flow Dynamics: Data, Models and Simulation,
      Springer-Verlag Berlin Heidelberg (2013). Page 395.
    ² Stefan Pischinger und Ulrich Seiffert. Vieweg Handbuch Kraftfahrzeugtechnik. Springer, 2016. Page 63.
    """

    def __init__(self, consumption_type, g=9.81, rho_air=1.225):
        self.consumption_type = consumption_type
        self.consumption = None
        self.power = None
        self.driving_resistance = None
        self.aerodynamic_drag = None
        self.rolling_resistance = None
        self.climbing_resistance = None
        self.inertial_resistance = None
        self.efficiency = None
        self.g = g
        self.rho_air = rho_air

    def calculate_consumption(self, speed, acceleration, gradient_angle, vehicle, cr=0.02, **kwargs):
        """ Calculate energy/fuel consumption

        Parameters
        ----------
        speed: numpy array
            vehicle speed in km/h
        acceleration: numpy array
            vehicle acceleration in m/s²
        gradient_angle: numpy array
            gradient angle (of the road) in radians
        vehicle : class Vehicle
            vehicle containing parameters like mass, air drag coefficient, etc.
        cr¹: float or numpy array
            rolling resistance coefficient (default 0.02)
        kwargs: dictionary
            efficiency: float or numpy array

        Returns
        -------
        self.consumption: numpy array
            instantaneous consumption for each sampling point (in l/h if consumption_type is 'fuel', in kW if consumption_type is 'energy')

        References for default values:
        ¹ Martin Treiber and Arne Kesting. “Traffic flow dynamics.” In: Traffic Flow Dynamics: Data, Models and Simulation,
          Springer-Verlag Berlin Heidelberg (2013). Page 395.
        """

        # TODO: check input type and convert lists to numpy arrays?
        # TODO: check units?
        # TODO: check NaN?

        if len(speed) != len(acceleration) or len(speed) != len(gradient_angle) or len(acceleration) != len(
                gradient_angle):
            raise Exception(
                "The arrays speed, acceleration and gradient_angle must have the same length!")

        # Extract parameters from vehicle
        mass = vehicle.mass
        cw = vehicle.cw
        cross_section = vehicle.cross_section
        idle_power = vehicle.idle_power
        calorific_value = vehicle.calorific_value
        fuel_type = vehicle.fuel_type
        min_efficiency = vehicle.min_efficiency
        max_efficiency = vehicle.max_efficiency

        # Transform speed from km/h to m/s
        speed = speed / 3.6

        self.calc_driving_resistance(
            speed, acceleration, gradient_angle, mass, cross_section, cw, cr)

        efficiency = kwargs.get('efficiency', None)
        if efficiency is None:
            efficiency = calc_efficiency(
                self.driving_resistance, -2000, 2000, min_efficiency, max_efficiency)
        self.efficiency = efficiency

        self.calc_engine_power(
            speed, self.driving_resistance, idle_power, fuel_type)
        if self.consumption_type == 'energy':
            self.consumption = self.power / efficiency
        else:
            self.consumption = self.power / (calorific_value * efficiency)

        return self.consumption

    def calc_engine_power(self, speed, driving_resistance, idle_power, fuel_type):
        """ Calculate engine power in kW """

        self.power = speed * driving_resistance / 1000
        # Allow negative consumption for electric cars
        if fuel_type != 'electric':
            self.power = np.maximum(self.power, idle_power)

        return self.power

    def calc_driving_resistance(self, speed, acceleration, gradient_angle, mass, cross_section, cw, cr):
        """ Calculate driving resistance in N """

        self.driving_resistance = self.calc_aerodynamic_drag(speed, cross_section, cw) \
            + self.calc_rolling_resistance(gradient_angle, mass, cr) \
            + self.calc_climbing_resistance(gradient_angle, mass) \
            + self.calc_inertial_resistance(acceleration, mass)
        return self.driving_resistance

    def calc_aerodynamic_drag(self, speed, cross_section, cw):
        """ Calculate aerodynamic drag in N """
        self.aerodynamic_drag = 0.5 * cw * \
            cross_section * self.rho_air * np.square(speed)
        return self.aerodynamic_drag

    def calc_rolling_resistance(self, gradient_angle, mass, cr):
        """ Calculate rolling resistance in N """
        self.rolling_resistance = mass * self.g * cr * np.cos(gradient_angle)
        return self.rolling_resistance

    def calc_climbing_resistance(self, gradient_angle, mass):
        """ Calculate climbing resistance in N """
        self.climbing_resistance = mass * self.g * np.sin(gradient_angle)
        return self.climbing_resistance

    def calc_inertial_resistance(self, acceleration, mass):
        """ Calculate inertial resistance in N """
        self.inertial_resistance = mass * acceleration
        return self.inertial_resistance


class ConsumptionStat:
    """ Statistical consumption model.

    consumption = a + b * speed^3 + c * speed * cos(grad_angle) + d * speed * sin(grad_angle) + e * speed * acceleration

    Parameters
    ----------
    a : float
        first coefficent (default 1.41)
    b : float
        second coefficent (default 0.000134)
    c : float
        third coefficent (default 0.0670)
    d : float
        fourth coefficent (default 1.90)
    e : float
        fifth coefficent (default 0.197)

    Attributes
    ----------
    consumption : numpy array
        consumption in l/h
    idle_consumption: float
        idle consumption in l (default 1.5)
    a : float
        first coefficent (default 1.41)
    b : float
        second coefficent (default 0.000134)
    c : float
        third coefficent (default 0.0670)
    d : float
        fourth coefficent (default 1.90)
    e : float
        fifth coefficent (default 0.197)

    """

    def __init__(self, a=1.41, b=0.000134, c=0.0670, d=1.90, e=0.197, idle_consumption=1.5):
        self.consumption = None
        self.idle_consumption = idle_consumption
        self.a = a
        self.b = b
        self.c = c
        self.d = d
        self.e = e

    def calculate_consumption(self, speed, acceleration, gradient_angle):
        """ Calculate fuel consumption

        Parameters
        ----------
        gradient_angle: numpy array
            gradient angle (of the road) in radians
        speed: numpy array
            vehicle speed in km/h
        acceleration: numpy array
            vehicle acceleration in m/s²

        Returns
        -------
        self.consumption: numpy array
            instantaneous consumption for each sampling point in l/h
        """

        # Transform speed from km/h to m/s
        speed = speed/3.6

        self.consumption = self.a + self.b * np.power(speed, 3) + self.c * speed * np.cos(gradient_angle) + \
            self.d * speed * np.sin(gradient_angle) + \
            self.e * speed * acceleration

        self.consumption = np.maximum(self.consumption, self.idle_consumption)

        return self.consumption


def accumulate_consumption(consumption, dt):
    """ Sum instantaneous consumption values over a whole track

    Parameters
    ----------
    consumption : numpy array
        instantaneous consumption in l/h or kW
    dt : numpy array
        interval times between measurements

    Returns
    -------
    accumulated consumption in l or kWh depending on input
    """

    # equation is applicable for both consumption types:
    # units: kW * s = kW * 1/3600 h = kWh / 3600
    # units: l/h * s = l/(3600 s) * s = l / 3600
    return np.sum(consumption * dt / 3600)


def consumption_per100km(consumption, dt, distance):
    """ Sum instantaneous consumption values over a whole track

    Parameters
    ----------
    consumption : numpy array
        instantaneous consumption in l/h or kW
    dt : numpy array
        interval times between measurements
    distance: float
        total trajectory distance in km

    Returns
    -------
    accumulated consumption in l or kWh depending on input
    """

    return 100 * accumulate_consumption(consumption, dt) / distance
