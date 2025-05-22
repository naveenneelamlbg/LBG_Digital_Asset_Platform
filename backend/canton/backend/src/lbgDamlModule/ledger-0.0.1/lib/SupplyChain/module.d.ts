// Generated from SupplyChain.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.ts/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type AcceptOrder = {
};

export declare const AcceptOrder:
  damlTypes.Serializable<AcceptOrder> & {
  }
;


export declare type ConfirmOrder = {
};

export declare const ConfirmOrder:
  damlTypes.Serializable<ConfirmOrder> & {
  }
;


export declare type Order = {
  supplier: damlTypes.Party;
  buyer: damlTypes.Party;
  product: string;
  quantity: damlTypes.Int;
  status: string;
};

export declare interface OrderInterface {
  ConfirmOrder: damlTypes.Choice<Order, ConfirmOrder, damlTypes.ContractId<Order>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Order, undefined>>;
  Archive: damlTypes.Choice<Order, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Order, undefined>>;
  AcceptOrder: damlTypes.Choice<Order, AcceptOrder, damlTypes.ContractId<Order>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Order, undefined>>;
}
export declare const Order:
  damlTypes.Template<Order, undefined, 'c02d6f4d4eaa633d92fcf6b39902af87a032d5264b92e9f7db24e985aec8cbc8:SupplyChain:Order'> &
  damlTypes.ToInterface<Order, never> &
  OrderInterface;

export declare namespace Order {
  export type CreateEvent = damlLedger.CreateEvent<Order, undefined, typeof Order.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Order, typeof Order.templateId>
  export type Event = damlLedger.Event<Order, undefined, typeof Order.templateId>
  export type QueryResult = damlLedger.QueryResult<Order, undefined, typeof Order.templateId>
}


