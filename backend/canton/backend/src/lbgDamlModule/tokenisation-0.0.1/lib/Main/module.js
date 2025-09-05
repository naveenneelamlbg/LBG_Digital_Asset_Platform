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

var pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 = require('@daml.ts/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var Asset = require('../Asset/module');


exports.MintRequest_Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MintRequest_Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MintRequest_Accept = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MintRequest = damlTypes.assembleTemplate(
{
  templateId: '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc:Main:MintRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, requester: damlTypes.Party.decoder, assetWallet: exports.AssetWallet.decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    requester: damlTypes.Party.encode(__typed__.requester),
    assetWallet: exports.AssetWallet.encode(__typed__.assetWallet),
  };
}
,
  MintRequest_Accept: {
    template: function () { return exports.MintRequest; },
    choiceName: 'MintRequest_Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MintRequest_Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.MintRequest_Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Asset.Asset).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Asset.Asset).encode(__typed__); },
  },
  MintRequest_Reject: {
    template: function () { return exports.MintRequest; },
    choiceName: 'MintRequest_Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MintRequest_Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.MintRequest_Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.MintRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MintRequest_Cancel: {
    template: function () { return exports.MintRequest; },
    choiceName: 'MintRequest_Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MintRequest_Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.MintRequest_Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MintRequest, ['785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc', '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc']);



exports.RequestTokens = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.Create_Customer_Wallet = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({recipient: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    recipient: damlTypes.Party.encode(__typed__.recipient),
  };
}
,
};



exports.AssetWallet = damlTypes.assembleTemplate(
{
  templateId: '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc:Main:AssetWallet',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(Asset.AssetType, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(Asset.AssetType, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetType: Asset.AssetType.decoder, holder: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    assetType: Asset.AssetType.encode(__typed__.assetType),
    holder: damlTypes.Party.encode(__typed__.holder),
  };
}
,
  Create_Customer_Wallet: {
    template: function () { return exports.AssetWallet; },
    choiceName: 'Create_Customer_Wallet',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Create_Customer_Wallet.decoder; }),
    argumentEncode: function (__typed__) { return exports.Create_Customer_Wallet.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetWallet).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetWallet).encode(__typed__); },
  },
  RequestTokens: {
    template: function () { return exports.AssetWallet; },
    choiceName: 'RequestTokens',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestTokens.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestTokens.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MintRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MintRequest).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AssetWallet; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AssetWallet, ['785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc', '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc']);

