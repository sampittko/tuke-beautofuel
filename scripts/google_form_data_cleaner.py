import pathlib
import pandas as pd

# Manually the following variables first
absolute_path = "/Users/sampittko/_dev/tuke/dp/beautofuel/scripts"
files = ["Experiment beautofuel - fáza č. 1",
         "Experiment beautofuel - fáza č. 2 (gamifikácia)", "Experiment beautofuel - fáza č. 2 (odmeny)", "Experiment beautofuel - fáza č. 3", "Experiment beautofuel - všeobecný prieskum"]
anonymize_column = "Používateľské meno"
# Same user with two e-mail addresses
exceptions = [["email@gmail.com", "eemail@gmail.com"]]

opened_files = []

# Read CSV
for i in range(len(files)):
    opened_files.append(pd.read_csv(
        absolute_path + "/data/" + files[i] + ".csv"))

users = []

# Get all users
for i in range(len(opened_files)):
    file_users = pd.unique(opened_files[i][anonymize_column])
    users.extend(file_users)

duplicated_number = None

# Anonymize users
users = pd.unique(users)
for i in range(len(users)):
    new_name = "participant_" + str(i)
    for j in range(len(opened_files)):
        # Merge two e-mail addresses
        if users[i] == exceptions[0][0] or users[i] == exceptions[0][1]:
            if not duplicated_number:
                duplicated_number = i
            new_name = "participant_" + str(duplicated_number)

        opened_files[j][anonymize_column] = opened_files[j][anonymize_column].replace(
            users[i], new_name)

# Write new CSV with cleaned data
for i in range(len(opened_files)):
    opened_files[j][anonymize_column] = opened_files[j][anonymize_column].replace(
        users[i], new_name)
    opened_files[i].to_csv(absolute_path + "/data/cleaned/" +
                           files[i] + ".csv", index=False)
