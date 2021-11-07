//Multi Sender Contract
const contract = {
    address: '0x24E10e76dBF9915E333EA7652CDB29fF3B2feceB',
    abi: [
            {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address payable[]",
          "name": "addrs",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "multiSender",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }

    ]
}

export default contract;
