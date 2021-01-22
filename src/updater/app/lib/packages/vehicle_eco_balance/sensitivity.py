import numpy as np


class Sensitivity:
    """ Sensitivity analysis for the physical (load-based) consumption model (class ConsumptionPhys).

    Parameters
    ----------
    efficiency: float or numpy array
        efficiency (dimensionless) (default 0.25)
    g: float
        gravitational acceleration in m/s² (default 9.81)
    rho_air: float
        air mass density in kg/m³ (default 1.225)
    calorific_value: float
        calorific value in kWh/l (default 9.12)
    cr: float
        rolling coefficient (default 0.02)
    cw: float
        air drag coefficient (default 0.3)
    mass: float
        vehicle mass in kg (default 1500)
    height: float
        vehicle height in m (default 1.55)
    width: float
        vehicle width in m (default 1.7)

    Attributes
    ----------
    identical to parameters
    """

    def __init__(self, rho_air=1.225, g=9.81, calorific_value=9.12, cr=0.02, cw=0.3, mass=1500, height=1.55, width=1.7, efficiency=0.25):
        self.rho_air = rho_air
        self.g = g
        self.calorific_value = calorific_value
        self.cr = cr
        self.cw = cw
        self.mass = mass
        self.height = height
        self.width = width
        self.efficiency = efficiency

    def dQ_mass(self, speed, acceleration, gradient_angle, dm):
        """ Calculate first order variation of consumption for a specified vehicle mass variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        acceleration: numpy array
            acceleration in m/s²
        gradient_angle: numpy array
            gradient angle in rad
        dm: float or numpy array
            vehicle mass variation in kg

        Returns
        -------
        numpy array
            consumption difference caused by vehicle mass variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * (self.g * (self.cr * np.cos(gradient_angle) + np.sin(gradient_angle)) + acceleration) * speed/3.6 * dm

    def dQ_width(self, speed, dw):
        """ Calculate first order variation of consumption for a specified vehicle width variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        dw: float or numpy array
            vehicle width variation in m

        Returns
        -------
        numpy array
            consumption difference caused by vehicle width variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * 0.5 * self.height * self.cw * self.rho_air * np.power(speed/3.6, 3) * dw

    def dQ_height(self, speed, dh):
        """ Calculate first order variation of consumption for a specified vehicle height variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
            gradient angle in rad
        dh: float or numpy array
            vehicle height variation in m

        Returns
        -------
        numpy array
            consumption difference caused by vehicle height variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * 0.5 * self.width * self.cw * self.rho_air * np.power(speed/3.6, 3) * dh

    def dQ_cw(self, speed, dcw):
        """ Calculate first order variation of consumption for a specified air drag coefficient variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        dcw: float or numpy array
            air drag coefficient variation (dimensionless)

        Returns
        -------
        numpy array
            consumption difference caused by air drag coefficient variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * 0.5 * self.width * self.height * self.rho_air * np.power(speed/3.6, 3) * dcw

    def dQ_cr(self, speed, gradient_angle, dcr):
        """ Calculate first order variation of consumption for a specified rolling coefficient variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        gradient_angle: numpy array
            gradient angle in rad
        dcr: float or numpy array
            rolling coefficient variation (dimensionless)

        Returns
        -------
        numpy array
            consumption difference caused by rolling coefficient variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * self.mass * self.g * np.cos(gradient_angle) * speed/3.6 * dcr

    def dQ_g(self, speed, gradient_angle, dg):
        """ Calculate first order variation of consumption for a specified gravitational acceleration variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        gradient_angle: numpy array
            gradient angle in rad
        dg: float or numpy array
            gravitational acceleration variation in kg

        Returns
        -------
        numpy array
            consumption difference caused by gravitational acceleration variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * self.mass * (self.cr * np.cos(gradient_angle) + np.sin(gradient_angle)) * speed/3.6 * dg

    def dQ_rho_air(self, speed, drho):
        """ Calculate first order variation of consumption for a specified air mass density variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        drho: float or numpy array
            air mass density variation in kg/m³

        Returns
        -------
        numpy array
            consumption difference caused by air mass density variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * 0.5 * self.height * self.width * self.cw * np.power(speed/3.6, 3) * drho

    def dQ_calorific_value(self, speed, acceleration, gradient_angle, dcal):
        """ Calculate first order variation of consumption for a specified calorific value variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        acceleration: numpy array
            acceleration in m/s²
        gradient_angle: numpy array
            gradient angle in rad
        dcal: float or numpy array
            calorific value variation in kWh/l

        Returns
        -------
        numpy array
            consumption difference caused by calorific value variation in l/h
        """
        return - 1 / (np.power(1000 * self.calorific_value, 2) * self.efficiency) * ( 0.5 * self.height * self.width * self.cw * self.rho_air * np.power(speed/3.6, 3) +
                self.mass * self.g * (self.cr * np.cos(gradient_angle) + np.sin(gradient_angle)) * speed/3.6 + self.mass * acceleration * speed/3.6 ) * 1000 * dcal

    def dQ_efficiency(self, speed, acceleration, gradient_angle, deff):
        """ Calculate first order variation of consumption for a specified efficiency variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        acceleration: numpy array
            acceleration in m/s²
        gradient_angle: numpy array
            gradient angle in rad
        deff: float or numpy array
            efficiency variation (ratio, NOT percent)

        Returns
        -------
        numpy array
            consumption difference caused by efficiency variation in l/h
        """
        return - 1 / (1000 * self.calorific_value * np.power(self.efficiency, 2)) * ( 0.5 * self.height * self.width * self.cw * self.rho_air * np.power(speed/3.6, 3) +
                self.mass * self.g * (self.cr * np.cos(gradient_angle) + np.sin(gradient_angle)) * speed/3.6 + self.mass * acceleration * speed/3.6) * deff

    def dQ_speed(self, speed, acceleration, gradient_angle, dspeed):
        """ Calculate first order variation of consumption for a specified speed variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        acceleration: numpy array
            acceleration in m/s²
        gradient_angle: numpy array
            gradient angle in rad
        dspeed: float or numpy array
            speed variation in km/h

        Returns
        -------
        numpy array
            consumption difference caused by speed variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * ( 1.5 * self.height * self.width * self.cw * self.rho_air * np.power(speed/3.6, 2) +
                self.mass * self.g * (self.cr * np.cos(gradient_angle) + np.sin(gradient_angle)) + self.mass * acceleration) * dspeed/3.6

    def dQ_acceleration(self, speed, dacc):
        """ Calculate first order variation of consumption for a specified acceleration variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        dacc: float or numpy array
            acceleration variation in m/s²

        Returns
        -------
        numpy array
            consumption difference caused by acceleration variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * self.mass * speed/3.6 * dacc

    def dQ_grad_angle(self, speed, gradient_angle, dgrad):
        """ Calculate first order variation of consumption for a specified gradient angle variation

        Parameters
        ----------
        speed: numpy array
            speed in km/h
        gradient_angle: numpy array
            gradient angle in rad
        dgrad: float or numpy array
            gradient angle variation in rad

        Returns
        -------
        numpy array
            consumption difference caused by gradient angle variation in l/h
        """
        return 1 / (1000 * self.calorific_value * self.efficiency) * self.mass * self.g * (np.cos(gradient_angle) - self.cr * np.sin(gradient_angle)) * speed/3.6 * dgrad


