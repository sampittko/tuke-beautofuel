import pathlib
import pandas as pd
import os

ABSOLUTE_PATH = os.path.abspath('.')
FILES = ["Experiment beautofuel - fáza č. 1",
         "Experiment beautofuel - fáza č. 2 (gamifikácia)", "Experiment beautofuel - fáza č. 2 (odmeny)", "Experiment beautofuel - fáza č. 3", "Experiment beautofuel - všeobecný prieskum"]
ANONYMIZE_COL = "Používateľské meno"

# Same user with multiple e-mail addresses
exception = ["email@gmail.com", "maile@gmail.com"]

opened_files = []

# Read CSV
for i in range(len(FILES)):
    opened_files.append(pd.read_csv(
        ABSOLUTE_PATH + "/data/" + FILES[i] + ".csv"))

users = []

# Get all users
for i in range(len(opened_files)):
    file_users = pd.unique(opened_files[i][ANONYMIZE_COL])
    users.extend(file_users)

exception_number = None

# Anonymize users
users = pd.unique(users)
for i in range(len(users)):
    new_name = "participant_" + str(i + 1)
    for j in range(len(opened_files)):
        # Merge two e-mail addresses
        if users[i] in exception:
            if not exception_number:
                exception_number = i + 1
            new_name = "participant_" + str(exception_number)

        opened_files[j][ANONYMIZE_COL] = opened_files[j][ANONYMIZE_COL].replace(
            users[i], new_name)

# Write new CSV with anonymized data
for i in range(len(opened_files)):
    opened_files[j][ANONYMIZE_COL] = opened_files[j][ANONYMIZE_COL].replace(
        users[i], new_name)
    opened_files[i].to_csv(ABSOLUTE_PATH + "/data/anonymized/" +
                           FILES[i] + ".csv", index=False)
