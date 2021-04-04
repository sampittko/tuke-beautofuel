import pandas as pd
import pathlib

# Manually the following variables first
filename = "tracks.csv"
absolute_path = "/Users/sampittko/_dev/tuke/dp/beautofuel/scripts"
keep_columns = ['name', 'time', 'begin', 'car', 'carEngineDisplacement', 'consumption', 'duration', 'end', 'fuelConsumed', 'id',
                'length', 'phase', 'score', 'scoreConsumption', 'scoreDuration', 'scoreFuelConsumed', 'scoreLength', 'scoreSpeed', 'speed', 'strategy', 'user']

# Read CSV
data = pd.read_csv(
    absolute_path + "/data/" + filename)

# Anonymize users
users = pd.unique(data['user'])
for i in range(len(users)):
    data['user'] = data['user'].replace(users[i], "participant_" + str(i))

# Write new CSV with cleaned data
new_file = data[keep_columns]
new_file.to_csv(absolute_path + "/data/cleaned/" +
                filename, index=False)
