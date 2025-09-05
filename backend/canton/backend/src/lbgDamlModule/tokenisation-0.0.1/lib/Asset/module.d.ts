// Generated from Asset.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.ts/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.ts/daml-stdlib-DA-Set-Types-1.0.0';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type Asset = {
  assetType: AssetType;
  holder: damlTypes.Party;
  amount: damlTypes.Numeric;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare interface AssetInterface {
  Archive: damlTypes.Choice<Asset, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Asset.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Asset, Asset.Key>>;
}
export declare const Asset:
  damlTypes.Template<Asset, Asset.Key, '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc:Asset:Asset'> &
  damlTypes.ToInterface<Asset, never> &
  AssetInterface;

export declare namespace Asset {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<AssetType, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Asset, Asset.Key, typeof Asset.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Asset, typeof Asset.templateId>
  export type Event = damlLedger.Event<Asset, Asset.Key, typeof Asset.templateId>
  export type QueryResult = damlLedger.QueryResult<Asset, Asset.Key, typeof Asset.templateId>
}



export declare type AssetType = {
  issuer: damlTypes.Party;
  symbol: string;
  custodian: damlTypes.Party;
  description: damlTypes.Optional<string>;
};

export declare const AssetType:
  damlTypes.Serializable<AssetType> & {
  }
;

