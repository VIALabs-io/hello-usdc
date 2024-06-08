# HelloUSDC

`HelloUSDC` is an example of sending USDC quickly and easily across chains, with arbitrary data to take further actions. Utilizing the VIALabs NPM package and MessageClient extension, it demonstrates a bridgeless approach to sending USDC and data on a contract to contract level.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js and npm (Node Package Manager)
- A text editor such as VSCode for editing `.sol` and `.ts` files
- GIT installed

Please visit [node documentation link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and the [git install documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for more information.

## Installation

Please open a terminal to run the following commands. You can use any terminal of your choice, including the built-in terminal in VSCode (Terminal -> New Terminal).

1. **Clone the Repository**: 
```bash
git clone https://github.com/VIALabs-io/hello-usdc.git
```

2. **Open in IDE**: 
After cloning the repository, if using VSCode or a similar IDE, you can now open the `hello-usdc` in your IDE of choice.
```bash
code hello-usdc
```

3. **Install Dependencies**: 
In VSCode (Terminal -> New Terminal):
```bash
npm install
```

4. **Set Up Environment Variables**:
Create a new `.env` file to set your EVM private key for contract deployment or copy and edit the existing `.env.example` to `.env`
```bash
PRIVATE_KEY=0000000000000000000000000000
```

## Deployment

Deploy the `HelloUSDC` contract to your desired networks. This must be done for each network you wish to operate on. You can see a list of our networks in the [VIALabs package documentation](https://developer.cryptolink.tech/general/supported-networks).

1. **Sepolia Testnet**:
```bash
npx hardhat --network ethereum-sepolia deploy
```

2. **Avalanche Testnet**:
```bash
npx hardhat --network avalanche-testnet deploy
```

## Configuration

Once all contracts are deployed across the desired networks and listed in `networks.json`, configure them using the provided script. Remember, if a new network is added later, all contracts must be reconfigured.

1. **Sepolia Testnet**:
```bash
npx hardhat --network ethereum-sepolia configure
```

2. **Avalanche Testnet**:
```bash
npx hardhat --network avalanche-testnet configure
```

## Usage

### Bridging USDC to Another Chain

To send tokens to another chain it is required to set the `--dest` parameter to the destination chain ID. The example below uses the ID for the Polygon Testnet. Chain IDs can be looked up in the [NPM package documentation](https://github.com/CryptoLinkTech/npm?tab=readme-ov-file#testnets).

```bash
npx hardhat --network ethereum-sepolia bridge-token --dest 43113 --amount 50
```

## Contract Breakdown of `HelloUSDC`


```solidity
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@cryptolink/contracts/features/FeatureUSDC.sol";

contract HelloUSDC is FeatureUSDC {
    constructor(IFeatureGateway _featureGateway) FeatureUSDC(_featureGateway) {}
    
    function send(uint _destChainId, address _recipient, uint _amount) external {
        SafeERC20.safeTransferFrom(IERC20(usdc), msg.sender, address(this), _amount);

        _sendUSDC(_destChainId, _recipient, _amount, abi.encode("any", 1, _recipient));
    }

    // required processing function, can process multiple features and data
    function _processMessageWithFeature(
        uint _txId,           // transaction id
        uint _sourceChainId,  // source chain id
        bytes memory _data,   // encoded message input data from source chain
        uint32 _featureId,    // feature id
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
```

### Function: `send`

```solidity
function send(
    uint _destChainId, 
    address _recipient, 
    uint _amount
) external {
    SafeERC20.safeTransferFrom(IERC20(usdc), msg.sender, address(this), _amount);

    _sendUSDC(_destChainId, _recipient, _amount, abi.encode("any", 1, _recipient));
}
```

- Allows a user to send USDC tokens to another chain.
- **Parameters**:
  - `_destChainId`: The ID of the destination chain.
  - `_recipient`: The recipient's address on the destination chain.
  - `_amount`: The amount of tokens to send.
- **Process**:
  - Transfers the specified `_amount` of USDC tokens from the sender's balance to the contract.
  - Encodes the `_recipient` address and additional data into bytes (`_featureData`).
  - Calls `_sendUSDC`, a function from `FeatureUSDC`, to send this encoded data to the destination chain.

### Function: `_processMessageWithFeature`

```solidity
function _processMessageWithFeature(
    uint _txId,           
    uint _sourceChainId,  
    bytes memory _data,   
    uint32 _featureId,    
    bytes memory _featureData, 
    bytes memory _featureReply 
) internal override {
    (string memory one, uint two, address three) = abi.decode(_featureData, (string, uint, address));

    // do something with the data
}
```

- Handles incoming messages from other chains and processes them based on the encoded feature data.
- **Parameters**:
  - `_txId`: The transaction ID.
  - `_sourceChainId`: The ID of the source chain from where the message is sent.
  - `_data`: Encoded message input data from the source chain.
  - `_featureId`: The feature ID associated with the message.
  - `_featureData`: Encoded feature input data from the source chain.
  - `_featureReply`: Encoded feature output data from off-chain processing.
- **Process**:
  - Decodes `_featureData` to extract relevant information.
  - Executes additional logic based on the decoded data.
