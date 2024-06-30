"use strict";
const membershipTypeMap = {
  "personal": {
    value: 0,
    label: "个人免费版"
  },
  "personalpro": {
    value: 1,
    label: "个人版pro"
  },
  "team": {
    value: 2,
    label: "团队版"
  }
};
const membershipValueMap = {
  0: membershipTypeMap.personal,
  1: membershipTypeMap.personalpro,
  2: membershipTypeMap.team
};
exports.membershipTypeMap = membershipTypeMap;
exports.membershipValueMap = membershipValueMap;
