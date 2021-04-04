import pandas as pd
import pathlib

# Manually the following variables first
absolute_path = "/Users/sampittko/_dev/tuke/dp/beautofuel/scripts"
filename_1 = "trackfeatures.csv"
filename_2 = "tracks.csv"
keep_columns_1 = ['name', 'time', 'car', 'carEngineDisplacement', 'consumption',
                  'emissions', 'id', 'phase', 'speed', 'strategy', 'track', 'user']
keep_columns_2 = ['name', 'time', 'begin', 'car', 'carEngineDisplacement', 'consumption', 'duration', 'end', 'fuelConsumed', 'id',
                  'length', 'phase', 'score', 'scoreConsumption', 'scoreDuration', 'scoreFuelConsumed', 'scoreLength', 'scoreSpeed', 'speed', 'strategy', 'user']

# Read CSV
data_1 = pd.read_csv(
    absolute_path + "/data/" + filename_1)
data_2 = pd.read_csv(
    absolute_path + "/data/" + filename_2)

# Anonymize users
users = pd.unique(data_1['user'])
for i in range(len(users)):
    new_name = "participant_" + str(i)
    data_1['user'] = data_1['user'].replace(users[i], new_name)
    data_2['user'] = data_2['user'].replace(users[i], new_name)

# Write new CSV with cleaned data
new_file_1 = data_1[keep_columns_1]
new_file_1.to_csv(absolute_path + "/data/cleaned/" +
                  filename_1, index=False)
new_file_2 = data_2[keep_columns_2]
new_file_2.to_csv(absolute_path + "/data/cleaned/" +
                  filename_2, index=False)
