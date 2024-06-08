// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@vialabs-io/contracts/features/FeatureUSDC.sol";

contract HelloUSDC is FeatureUSDC {
    constructor(IFeatureGateway _featureGateway) FeatureUSDC(_featureGateway) {}
    
    function send(uint _destChainId, address _recipient, uint _amount) external {
        SafeERC20.safeTransferFrom(IERC20(usdc), msg.sender, address(this), _amount);

        _sendUSDC(_destChainId, _recipient, _amount, abi.encode("any",1,_recipient));
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
        // USDC already sent to the _recipient here on the destination that was specified in the
        // send() on the source chain, no need to do anything else .. use the USDC as you wish
        // for example, follow encoded instructions from the passed data to stake/split payment/etc.

        (string memory one, uint two, address three) = abi.decode(_featureData, (string, uint, address));

        // do something with the data
    }
}