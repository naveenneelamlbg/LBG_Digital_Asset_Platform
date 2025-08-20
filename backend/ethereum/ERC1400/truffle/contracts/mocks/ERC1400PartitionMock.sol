pragma solidity ^0.5.0;
import "../token/ERC1400Partition/ERC1400Partition.sol";


contract ERC1400PartitionMock is ERC1400Partition {

  constructor(
    string memory name,
    string memory symbol,
    uint256 granularity,
    address[] memory controllers,
    address certificateSigner,
    bool certificateActivated,
    bytes32[] memory defaultPartitions,
    address tokenHolderMock,
    uint256 valueMock
  )
    public
    ERC1400Partition(name, symbol, granularity, controllers, certificateSigner, certificateActivated, defaultPartitions)
  {
    _issue(msg.sender, tokenHolderMock, valueMock, "", "");
  }

}
