// Generated from Token.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.ts/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type Purchase = {
  buyer: damlTypes.Party;
  purchaseAmount: damlTypes.Int;
};

export declare const Purchase:
  damlTypes.Serializable<Purchase> & {
  }
;


export declare type Redeem = {
  redeemAmount: damlTypes.Int;
};

export declare const Redeem:
  damlTypes.Serializable<Redeem> & {
  }
;


export declare type Transfer = {
  newOwner: damlTypes.Party;
  transferAmount: damlTypes.Int;
};

export declare const Transfer:
  damlTypes.Serializable<Transfer> & {
  }
;


export declare type Mint = {
  newAmount: damlTypes.Int;
};

export declare const Mint:
  damlTypes.Serializable<Mint> & {
  }
;


export declare type Token = {
  issuer: damlTypes.Party;
  owner: damlTypes.Party;
  amount: damlTypes.Int;
  name: string;
  symbol: string;
  tokenValue: damlTypes.Int;
};

export declare interface TokenInterface {
  Mint: damlTypes.Choice<Token, Mint, damlTypes.ContractId<Token>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Token, undefined>>;
  Transfer: damlTypes.Choice<Token, Transfer, damlTypes.Optional<pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Token>, damlTypes.Optional<damlTypes.ContractId<Token>>>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Token, undefined>>;
  Redeem: damlTypes.Choice<Token, Redeem, damlTypes.Optional<damlTypes.ContractId<Token>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Token, undefined>>;
  Archive: damlTypes.Choice<Token, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Token, undefined>>;
  Purchase: damlTypes.Choice<Token, Purchase, damlTypes.ContractId<Token>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Token, undefined>>;
}
export declare const Token:
  damlTypes.Template<Token, undefined, 'c02d6f4d4eaa633d92fcf6b39902af87a032d5264b92e9f7db24e985aec8cbc8:Token:Token'> &
  damlTypes.ToInterface<Token, never> &
  TokenInterface;

export declare namespace Token {
  export type CreateEvent = damlLedger.CreateEvent<Token, undefined, typeof Token.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Token, typeof Token.templateId>
  export type Event = damlLedger.Event<Token, undefined, typeof Token.templateId>
  export type QueryResult = damlLedger.QueryResult<Token, undefined, typeof Token.templateId>
}


