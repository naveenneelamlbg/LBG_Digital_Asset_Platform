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


exports.AcceptOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ConfirmOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Order = damlTypes.assembleTemplate(
{
  templateId: '84f9b61ce780e10297f64b2b8386ce097d5e1359e875cd8e1dca1839d89c8021:SupplyChain:Order',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({supplier: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, product: damlTypes.Text.decoder, quantity: damlTypes.Int.decoder, status: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    supplier: damlTypes.Party.encode(__typed__.supplier),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    product: damlTypes.Text.encode(__typed__.product),
    quantity: damlTypes.Int.encode(__typed__.quantity),
    status: damlTypes.Text.encode(__typed__.status),
  };
}
,
  ConfirmOrder: {
    template: function () { return exports.Order; },
    choiceName: 'ConfirmOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfirmOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Order).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Order).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Order; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AcceptOrder: {
    template: function () { return exports.Order; },
    choiceName: 'AcceptOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Order).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Order).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Order, ['84f9b61ce780e10297f64b2b8386ce097d5e1359e875cd8e1dca1839d89c8021', '84f9b61ce780e10297f64b2b8386ce097d5e1359e875cd8e1dca1839d89c8021']);

