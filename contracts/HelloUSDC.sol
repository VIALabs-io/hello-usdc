// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@vialabs-io/contracts/features/ProtoCCTP.sol";

contract HelloUSDC is ProtoCCTP {   
    function send(uint _destChainId, address _recipient, uint _amount) external {
        SafeERC20.safeTransferFrom(IERC20(usdc), msg.sender, address(this), _amount);

        _sendUSDC(_destChainId, _recipient, _amount);
    }

    // required processing function, can process multiple features and data
    function _processMessageWithFeature(
        uint _txId,           // transaction id
        uint _sourceChainId,  // source chain id
        bytes memory _data,   // encoded message input data from source chain
        uint32 _featureId, // feature id
        bytes memory _featureData, // encoded feature input data from source chain
        bytes memory _featureReply // encoded feature output data from off-chain
    ) internal override {
    }
}