fuel_types = {
    'electric': {
        'calorific_value': None,
        'min_efficiency': 0.9,
        'max_efficiency': 0.9
    },
    'gasoline': {
        'calorific_value': 9.12,  # in kWh/l
        'min_efficiency': 0.1,
        'max_efficiency': 0.38
    },
    'diesel': {
        'calorific_value': 9.97,  # in kWh/l
        'min_efficiency': 0.1,
        'max_efficiency': 0.43
    }
}


class Vehicle:
    def __init__(self, mass):
        self.mass = mass


class Car(Vehicle):
    """
    Holds values specific to a car.

    Parameters
    ----------
    mass¹: float
        vehicle mass in kg
    cross_section: float
        car cross sectional area in m² (default 2.635, corresponds to width * height: 1.7 * 1.55)
    cw¹: float
        air drag coefficient, dimensionless (default 0.3)
    fuel_type: str
        'gasoline', 'diesel' or 'electric' (default gasoline)
    idle_power: float
        idle power consumption in kW (default 2.0)
    calorific_value²: float
        calorific value of the used fuel in kWh/l (default for gasoline 9.12, default for diesel 9.97)
    min_efficiency²: float
        minimum efficiency (default for gasoline/diesel 0.1 (i.e. 10 %), default for electric 0.9 (i.e. 90 %))
    max_efficiency³: float
        maximum efficiency (default for gasoline 0.38 (i.e. 38 %), default for diesel 0.43 (i.e. 43 %), default for electric 0.9 (i.e. 90 %))

    References for default values:
    ¹ Martin Treiber and Arne Kesting. “Traffic flow dynamics.” In: Traffic Flow Dynamics: Data, Models and Simulation,
      Springer-Verlag Berlin Heidelberg (2013). Page 395.
    ² Metin Ersoy und Stefan Gies. Fahrwerkhandbuch: Grundlagen–Fahrdynamik–Fahrverhalten–Komponenten–Elektronische Systeme–
      Fahrerassistenz–Autonomes Fahren–Perspektiven. Springer-Verlag, 2017. Page 75/76.
    ³ Stefan Pischinger und Ulrich Seiffert. Vieweg Handbuch Kraftfahrzeugtechnik. Springer, 2016. Page 261.
    """
    def __init__(self, mass=1500, cross_section=2.635, cw=0.3, fuel_type='gasoline', idle_power=2.0,
                 calorific_value=None, min_efficiency=None, max_efficiency=None):

        super().__init__(mass)
        self.cross_section = cross_section
        self.cw = cw
        self.fuel_type = fuel_type
        self.idle_power = idle_power
        if calorific_value is None:
            self.calorific_value = fuel_types.get(self.fuel_type).get('calorific_value')
        else:
            self.calorific_value = calorific_value
        if min_efficiency is None:
            self.min_efficiency = fuel_types.get(self.fuel_type).get('min_efficiency')
        else:
            self.min_efficiency = min_efficiency
        if max_efficiency is None:
            self.max_efficiency = fuel_types.get(self.fuel_type).get('max_efficiency')
        else:
            self.max_efficiency = max_efficiency

    def __str__(self):
        return "Car properties: \n mass: {} \n cross_section: {} \n cw: {} \n fuel_type: {} \n idle_power: {} \n calorific_value: {} \n min_efficiency: {} \n max_efficiency: {}".format(
            self.mass, self.cross_section, self.cw, self.fuel_type, self.idle_power, self.calorific_value,
            self.min_efficiency, self.max_efficiency)


class Airplane(Vehicle):
    pass


class Ship(Vehicle):
    pass
