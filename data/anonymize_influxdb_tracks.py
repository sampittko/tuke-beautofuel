import pandas as pd
import pathlib
import os

TRACKS_FILENAME = "tracks.csv"
TRACKFEATURES_FILENAME = "trackfeatures.csv"

DATA_DIR_ABSOLUTE_PATH = os.path.abspath('./data')
ANONYMIZED_DATA_DIR_ABSOLUTE_PATH = os.path.abspath('./data/anonymized')

TRACKS_KEEP_COLS = ['time', 'begin', 'car', 'carEngineDisplacement', 'consumption',
                    'duration', 'end', 'fuelConsumed', 'id', 'length', 'phase', 'score', 'speed', 'strategy', 'user']
TRACKFEATURES_KEEP_COLS = ['time', 'car', 'carEngineDisplacement', 'consumption',
                           'emissions', 'id', 'lat', 'lng', 'phase', 'speed', 'strategy', 'track', 'user']

# Read CSV files
tracks_data = pd.read_csv(DATA_DIR_ABSOLUTE_PATH + "/" + TRACKS_FILENAME)
trackfeatures_data = pd.read_csv(
    DATA_DIR_ABSOLUTE_PATH + "/" + TRACKFEATURES_FILENAME)

# Anonymize participants
users = pd.unique(tracks_data['user'])
for i in range(len(users)):
    new_name = "participant_" + str(i + 1)
    tracks_data['user'] = tracks_data['user'].replace(users[i], new_name)
    trackfeatures_data['user'] = trackfeatures_data['user'].replace(
        users[i], new_name)

# Write new CSV with anonymized data
new_tracks_data = tracks_data[TRACKS_KEEP_COLS]
new_tracks_data.to_csv(ANONYMIZED_DATA_DIR_ABSOLUTE_PATH + "/" +
                       TRACKS_FILENAME, index=False)
new_trackfeatures_data = trackfeatures_data[TRACKFEATURES_KEEP_COLS]
new_trackfeatures_data.to_csv(ANONYMIZED_DATA_DIR_ABSOLUTE_PATH + "/" +
                              TRACKFEATURES_FILENAME, index=False)
