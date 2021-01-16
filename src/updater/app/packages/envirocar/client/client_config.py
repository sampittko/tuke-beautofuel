
class ECConfig:

    class _ECConfig:
        CONFIG_PARAMS = {
            "ec_base_url": "https://envirocar.org/api/stable/",
            "ec_username": "",
            "ec_password": "",
            "number_of_processes": 4
        }

        def __init__(self, username, password):
            self.CONFIG_PARAMS['ec_username'] = username
            self.CONFIG_PARAMS['ec_password'] = password
            self.load_config()

        def load_config(self):
            for key, value in self.CONFIG_PARAMS.items():
                setattr(self, key, value)

    _instance = None

    def __init__(self, username=None, password=None):
        if not ECConfig._instance:
            ECConfig._instance = self._ECConfig(username, password)

        for item in ECConfig._instance.CONFIG_PARAMS:
            setattr(self, item, getattr(ECConfig._instance, item))
