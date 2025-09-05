// Generated from Main.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.ts/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Asset from '../Asset/module';

export declare type MintRequest_Cancel = {
};

export declare const MintRequest_Cancel:
  damlTypes.Serializable<MintRequest_Cancel> & {
  }
;


export declare type MintRequest_Reject = {
};

export declare const MintRequest_Reject:
  damlTypes.Serializable<MintRequest_Reject> & {
  }
;


export declare type MintRequest_Accept = {
};

export declare const MintRequest_Accept:
  damlTypes.Serializable<MintRequest_Accept> & {
  }
;


export declare type MintRequest = {
  amount: damlTypes.Numeric;
  requester: damlTypes.Party;
  assetWallet: AssetWallet;
};

export declare interface MintRequestInterface {
  MintRequest_Accept: damlTypes.Choice<MintRequest, MintRequest_Accept, damlTypes.ContractId<Asset.Asset>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MintRequest, undefined>>;
  MintRequest_Reject: damlTypes.Choice<MintRequest, MintRequest_Reject, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MintRequest, undefined>>;
  Archive: damlTypes.Choice<MintRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MintRequest, undefined>>;
  MintRequest_Cancel: damlTypes.Choice<MintRequest, MintRequest_Cancel, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MintRequest, undefined>>;
}
export declare const MintRequest:
  damlTypes.Template<MintRequest, undefined, '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc:Main:MintRequest'> &
  damlTypes.ToInterface<MintRequest, never> &
  MintRequestInterface;

export declare namespace MintRequest {
  export type CreateEvent = damlLedger.CreateEvent<MintRequest, undefined, typeof MintRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<MintRequest, typeof MintRequest.templateId>
  export type Event = damlLedger.Event<MintRequest, undefined, typeof MintRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<MintRequest, undefined, typeof MintRequest.templateId>
}



export declare type RequestTokens = {
  amount: damlTypes.Numeric;
};

export declare const RequestTokens:
  damlTypes.Serializable<RequestTokens> & {
  }
;


export declare type Create_Customer_Wallet = {
  recipient: damlTypes.Party;
};

export declare const Create_Customer_Wallet:
  damlTypes.Serializable<Create_Customer_Wallet> & {
  }
;


export declare type AssetWallet = {
  assetType: Asset.AssetType;
  holder: damlTypes.Party;
};

export declare interface AssetWalletInterface {
  Create_Customer_Wallet: damlTypes.Choice<AssetWallet, Create_Customer_Wallet, damlTypes.ContractId<AssetWallet>, AssetWallet.Key> & damlTypes.ChoiceFrom<damlTypes.Template<AssetWallet, AssetWallet.Key>>;
  RequestTokens: damlTypes.Choice<AssetWallet, RequestTokens, damlTypes.ContractId<MintRequest>, AssetWallet.Key> & damlTypes.ChoiceFrom<damlTypes.Template<AssetWallet, AssetWallet.Key>>;
  Archive: damlTypes.Choice<AssetWallet, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, AssetWallet.Key> & damlTypes.ChoiceFrom<damlTypes.Template<AssetWallet, AssetWallet.Key>>;
}
export declare const AssetWallet:
  damlTypes.Template<AssetWallet, AssetWallet.Key, '785800ee427d5983136c140118ce6de18de29f1c25ddef8f497449b71de2dfbc:Main:AssetWallet'> &
  damlTypes.ToInterface<AssetWallet, never> &
  AssetWalletInterface;

export declare namespace AssetWallet {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<Asset.AssetType, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<AssetWallet, AssetWallet.Key, typeof AssetWallet.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetWallet, typeof AssetWallet.templateId>
  export type Event = damlLedger.Event<AssetWallet, AssetWallet.Key, typeof AssetWallet.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetWallet, AssetWallet.Key, typeof AssetWallet.templateId>
}


