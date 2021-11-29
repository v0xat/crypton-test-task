//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.10;

contract SimpleFunding is Ownable {
  address[] public funders;
  mapping(address => uint256) public funderAddressToAmount;
  
  function fund() external payable {
    require(msg.value > 0, "Need more ETH");

    // Добавляем адрес в массив funders только при
    // первом пожертвовании (чтобы избежать дублирования в будущем)
    if (funderAddressToAmount[msg.sender] == 0) {
      funders.push(msg.sender);
    }
    funderAddressToAmount[msg.sender] += msg.value;
  }

  function getFunders() external view returns(address[] memory) {
    return funders;
  }
  
  function withdrawTo(address payable _to) external onlyOwner {
    _to.transfer(address(this).balance);
    
    // Нужно ли обнулять балансы при выводе ?
    // for (uint256 i = 0; i < funders.length; i++) {
    //     address funder = funders[i];
    //     funderAddressToAmount[funder] = 0;
    // }
    // delete funders;
  }
}