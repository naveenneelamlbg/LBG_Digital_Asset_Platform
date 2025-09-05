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
var pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 = require('@daml.ts/daml-stdlib-DA-Set-Types-1.0.0');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');


exports.Asset = damlTypes.assembleTemplate(
{
  templateId: '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc:Asset:Asset',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.AssetType, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.AssetType, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetType: exports.AssetType.decoder, holder: damlTypes.Party.decoder, amount: damlTypes.Numeric(10).decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetType: exports.AssetType.encode(__typed__.assetType),
    holder: damlTypes.Party.encode(__typed__.holder),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.Asset; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Asset, ['785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc', '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc']);



exports.AssetType = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuer: damlTypes.Party.decoder, symbol: damlTypes.Text.decoder, custodian: damlTypes.Party.decoder, description: damlTypes.Optional(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuer: damlTypes.Party.encode(__typed__.issuer),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    description: damlTypes.Optional(damlTypes.Text).encode(__typed__.description),
  };
}
,
};

