import json

dct = {
    "id": 10,
    "wshOrPyUsrId": 2,
    "dshOrToUsrId": None,
    "groupId": 1,
    "note": "2 pays 3",
    "dishSize": 0,
    "dishNum": 0,
    "dishDirt": 0,
    "pay": 9.94,
}

test = json.dumps(dct)
print(test)

# this shows that none becomes null