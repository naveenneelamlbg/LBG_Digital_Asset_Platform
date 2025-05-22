// Generated from Fund.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type Transfer = {
  newOwner: damlTypes.Party;
  newParticipants: damlTypes.Party[];
};

export declare const Transfer:
  damlTypes.Serializable<Transfer> & {
  }
;


export declare type SterlingShortTermMoneyMarketFundVASSTAI = {
  owner: damlTypes.Party;
  issuer: damlTypes.Party;
  amount: damlTypes.Numeric;
  participants: damlTypes.Party[];
  couponRate: damlTypes.Int;
  maturityDate: string;
};

export declare interface SterlingShortTermMoneyMarketFundVASSTAIInterface {
  Archive: damlTypes.Choice<SterlingShortTermMoneyMarketFundVASSTAI, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<SterlingShortTermMoneyMarketFundVASSTAI, undefined>>;
  Transfer: damlTypes.Choice<SterlingShortTermMoneyMarketFundVASSTAI, Transfer, damlTypes.ContractId<SterlingShortTermMoneyMarketFundVASSTAI>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<SterlingShortTermMoneyMarketFundVASSTAI, undefined>>;
}
export declare const SterlingShortTermMoneyMarketFundVASSTAI:
  damlTypes.Template<SterlingShortTermMoneyMarketFundVASSTAI, undefined, 'c02d6f4d4eaa633d92fcf6b39902af87a032d5264b92e9f7db24e985aec8cbc8:Fund:SterlingShortTermMoneyMarketFundVASSTAI'> &
  damlTypes.ToInterface<SterlingShortTermMoneyMarketFundVASSTAI, never> &
  SterlingShortTermMoneyMarketFundVASSTAIInterface;

export declare namespace SterlingShortTermMoneyMarketFundVASSTAI {
  export type CreateEvent = damlLedger.CreateEvent<SterlingShortTermMoneyMarketFundVASSTAI, undefined, typeof SterlingShortTermMoneyMarketFundVASSTAI.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SterlingShortTermMoneyMarketFundVASSTAI, typeof SterlingShortTermMoneyMarketFundVASSTAI.templateId>
  export type Event = damlLedger.Event<SterlingShortTermMoneyMarketFundVASSTAI, undefined, typeof SterlingShortTermMoneyMarketFundVASSTAI.templateId>
  export type QueryResult = damlLedger.QueryResult<SterlingShortTermMoneyMarketFundVASSTAI, undefined, typeof SterlingShortTermMoneyMarketFundVASSTAI.templateId>
}


