// params:
  // wopObjArr -- array of washOrPay objects
  // grpUsrIDsArr -- array of all the users in the group
  // pntPrice -- number representing how much one dish point is worth in this group

const calcDebts = function (wopObjArr, grpUsrIDsArr, pntPrice) {
  let debts = {};

  // create keys for debts obj, default values = 0
  for (let i = 0; i < grpUsrIDsArr.length - 1; i++) {
    for (let j = i + 1; j < grpUsrIDsArr.length; j++) {
      let tag = `${grpUsrIDsArr[i]}->${grpUsrIDsArr[j]}`;
      debts[tag] = 0;
    }
  }

  // put ids into variables
  for (wop of wopObjArr) {
    let wpID = wop.wshOrPyUsrId;
    let dtID = wop.dshOrToUsrId;

    // if one of the users no longer in group, skip by continue
    if (
      !grpUsrIDsArr.includes(wpID) ||
      (dtID && !grpUsrIDsArr.includes(dtID))
    ) {
      continue;
    }

    // calculate transaction from pay or other vars (measured in dish points)
    let dshPnts = wop.pay
      ? wop.pay / pntPrice
      : wop.dishSize * wop.dishNum * wop.dishDirt;

      // if dtID is '' (empty string), this indicates doing communal dishes, divide cost between everyone else
    if (!dtID) {
      for (key of Object.keys(debts)) {
        let split = dshPnts / (grpUsrIDsArr.length - 1);

        if (key.endsWith(String(wpID))) {
          debts[key] += split;
        }
        if (key.startsWith(String(wpID))) {
          debts[key] -= split;
        }
      }
      continue;
    }

    // one user to another user
    let users = [wpID, dtID];
    users.sort();
    let tag = `${users[0]}->${users[1]}`;

    if (wpID > dtID) {
      debts[tag] = debts[tag] + dshPnts;
    } else {
      debts[tag] = debts[tag] - dshPnts;
    }
  }

  // make debts show points and money
  for (key of Object.keys(debts)) {
    pnts = Math.round(debts[key] * 10) / 10;
    debts[key] = {
      dishPoints: pnts,
      dollars: Math.round(pnts * pntPrice * 100) / 100,
    };
  }

  return debts;
};

// size = 1 - 5, utensil - crock pot
// number 1 - 500
// dirtiness 1 - 5, clean - dirty

const exWopObjArr = [
  // test one user do dishes for another user
  {
    id: 1,
    wshOrPyUsrId: 1,
    dshOrToUsrId: 2,
    groupId: 1,
    note: 'I cleaned up your din din',
    dishSize: 2,
    dishNum: 5,
    dishDirt: 5,
    pay: 0,
  },
  {
    id: 2,
    wshOrPyUsrId: 1,
    dshOrToUsrId: 2,
    groupId: 1,
    note: 'Stop leaving cereal bowl',
    dishSize: 1,
    dishNum: 3,
    dishDirt: 2,
    pay: 0,
  },
  {
    id: 3,
    wshOrPyUsrId: 1,
    dshOrToUsrId: 2,
    groupId: 1,
    note: 'Why you so dirty?',
    dishSize: 3,
    dishNum: 5,
    dishDirt: 5,
    pay: 0,
  },
  {
    id: 4,
    wshOrPyUsrId: 2,
    dshOrToUsrId: 1,
    groupId: 1,
    note: 'Right back at you',
    dishSize: 1,
    dishNum: 10,
    dishDirt: 3,
    pay: 0,
  },
  {
    id: 5,
    wshOrPyUsrId: 2,
    dshOrToUsrId: 1,
    groupId: 1,
    note: 'Caught you sleeping',
    dishSize: 3,
    dishNum: 4,
    dishDirt: 4,
    pay: 0,
  },
  {
    id: 6,
    wshOrPyUsrId: 3,
    dshOrToUsrId: 2,
    groupId: 1,
    note: 'Did your dishes',
    dishSize: 3,
    dishNum: 6,
    dishDirt: 4,
    pay: 0,
  },
  {
    id: 7,
    wshOrPyUsrId: 3,
    dshOrToUsrId: 1,
    groupId: 1,
    note: "Did Bob's dishes",
    dishSize: 3,
    dishNum: 6,
    dishDirt: 3,
    pay: 0,
  },
  // test one user do dishes for group
  {
    id: 8,
    wshOrPyUsrId: 3,
    dshOrToUsrId: '',
    groupId: 1,
    note: '3 did group dishes',
    dishSize: 3,
    dishNum: 5,
    dishDirt: 3,
    pay: 0,
  },
  {
    id: 9,
    wshOrPyUsrId: 1,
    dshOrToUsrId: '',
    groupId: 1,
    note: '1 did group dishes',
    dishSize: 1,
    dishNum: 2,
    dishDirt: 5,
    pay: 0,
  },
  {
    id: 10,
    wshOrPyUsrId: 2,
    dshOrToUsrId: '',
    groupId: 1,
    note: '2 did group dishes',
    dishSize: 2,
    dishNum: 2,
    dishDirt: 5,
    pay: 0,
  },
  // test user no longer in group
  {
    id: 10,
    wshOrPyUsrId: 5,
    dshOrToUsrId: 1,
    groupId: 1,
    note: '5 did dishes for 1',
    dishSize: 2,
    dishNum: 2,
    dishDirt: 5,
    pay: 0,
  },
  // test input is payment, not dishes
  {
    id: 10,
    wshOrPyUsrId: 2,
    dshOrToUsrId: 3,
    groupId: 1,
    note: '2 pays 3',
    dishSize: 0,
    dishNum: 0,
    dishDirt: 0,
    pay: 16.06,
  },
  {
    id: 10,
    wshOrPyUsrId: 2,
    dshOrToUsrId: 1,
    groupId: 1,
    note: '2 pays 3',
    dishSize: 0,
    dishNum: 0,
    dishDirt: 0,
    pay: 9.94,
  },
];

const grpUsrIDsArr = [1, 2, 3, 4];
const pntPrice = 0.2;

console.log(calcDebts(exWopObjArr, grpUsrIDsArr, pntPrice));
