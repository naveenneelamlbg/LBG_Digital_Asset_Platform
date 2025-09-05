"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');


exports.Transfer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newOwner: damlTypes.Party.decoder, newParticipants: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newOwner: damlTypes.Party.encode(__typed__.newOwner),
    newParticipants: damlTypes.List(damlTypes.Party).encode(__typed__.newParticipants),
  };
}
,
};



exports.SterlingShortTermMoneyMarketFundVASSTAI = damlTypes.assembleTemplate(
{
  templateId: '84f9b61ce780e10297f64b2b8386ce097d5e1359e875cd8e1dca1839d89c8021:Fund:SterlingShortTermMoneyMarketFundVASSTAI',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, issuer: damlTypes.Party.decoder, amount: damlTypes.Numeric(10).decoder, participants: damlTypes.List(damlTypes.Party).decoder, couponRate: damlTypes.Int.decoder, maturityDate: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    participants: damlTypes.List(damlTypes.Party).encode(__typed__.participants),
    couponRate: damlTypes.Int.encode(__typed__.couponRate),
    maturityDate: damlTypes.Text.encode(__typed__.maturityDate),
  };
}
,
  Archive: {
    template: function () { return exports.SterlingShortTermMoneyMarketFundVASSTAI; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Transfer: {
    template: function () { return exports.SterlingShortTermMoneyMarketFundVASSTAI; },
    choiceName: 'Transfer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Transfer.decoder; }),
    argumentEncode: function (__typed__) { return exports.Transfer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.SterlingShortTermMoneyMarketFundVASSTAI).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.SterlingShortTermMoneyMarketFundVASSTAI).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.SterlingShortTermMoneyMarketFundVASSTAI, ['84f9b61ce780e10297f64b2b8386ce097d5e1359e875cd8e1dca1839d89c8021', '84f9b61ce780e10297f64b2b8386ce097d5e1359e875cd8e1dca1839d89c8021']);

