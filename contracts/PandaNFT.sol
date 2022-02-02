// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import 1155 token contract from Openzeppelin
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Example contract to be deployed via https://remix.ethereum.org/ for testing purposes.
// This will be separate from the front end

contract PandaNFT is ERC1155, Ownable {
    // using SafeMath for uint256;

    event NewPanda(address indexed _owner, uint256 _id);

    uint256 private COUNTER;
    uint256 public fee = 10**17;
    uint256 public classLimit = 3;
    uint256 public equipLimit = 30;
    uint256 public rarityLimit = 100;
    bool public paused = true;
    

    constructor() ERC1155(
        "ipfs://QmRgYRMjrnT4Ze5uJ4Q6aYoB9yqyL1hShnCZwta7N3x3kY/metadata/{id}.json" //Get from Moralis
    ) {}

    struct Panda {
        uint256 id;
        uint256 rarity; // Natural, Prime, Champion, Imp, Divine
        uint256 class; // 0 = Peasant, 1 = First Class, 2 = Elite Class, 3 = Royal Class
        uint256 equip1; // For loop to make sure every combination is unique
        uint256 equip2;
        uint256 equip3;
        uint256 mintDate;
        // bool isReadyToAdvance; // Use this for advancing class
        bool locked;
    }

    struct Rarities {
        uint256 natural;
        uint256 prime;
        uint256 champion;
        uint256 imp;
        uint256 divine;
    }

    Panda[] public pandas;
    // Rarities public rarities = Rarities(80, 10, 5, 4, 1);
    Rarities public rarities = Rarities(20, 40, 60, 80, 99);

    function getPandas() public view returns (Panda[] memory) { return pandas; }
    function setPaused() public onlyOwner { paused = !paused; }
    function setFee(uint256 _fee) public onlyOwner { fee = _fee; } // In wei
    function setClassLimit(uint256 _classLimit) public onlyOwner { classLimit = _classLimit; }
    function setEquipLimit(uint256 _equipLimit) public onlyOwner { equipLimit = _equipLimit; }
    function setRarityLimit(uint256 _rarityLimit) public onlyOwner { rarityLimit = _rarityLimit; }
    function setLocked(uint256 _id) public onlyOwner { pandas[_id].locked = !pandas[_id].locked; }
    function setRarities(uint256 _natural, uint256 _prime, uint256 _champion, uint256 _imp, uint256 _divine) public onlyOwner {
        Rarities memory _rarities = Rarities(_natural, _prime, _champion, _imp, _divine);
        rarities = _rarities;
    }

    
    function mintPanda() public payable {
        require(paused == false, "Minting is paused at the moment. Please try again later.");
        require(msg.value == fee, "Please send the correct fee.");

        (uint _equip1, uint _equip2, uint _equip3, uint _rarity) = getRandomNumber(equipLimit);
        _rarity = getRarity(_rarity);

        Panda memory newPanda = Panda(
                                    COUNTER,
                                    _rarity,
                                    0, 
                                    _equip1, 
                                    _equip2, 
                                    _equip3, 
                                    block.timestamp,
                                    false
                                );
        pandas.push(newPanda);

        _mint(msg.sender, COUNTER, 1, "");
        emit NewPanda(msg.sender, COUNTER);
        COUNTER++;
    }


    function sacrifice(uint256 _burnId, uint256 _advanceId) public {
        require(pandas[_burnId].class == pandas[_advanceId].class, "Both pandas must be the same class.");
        require(classLimit > pandas[_advanceId].class, "Panda is already at the maximum class.");
        require(balanceOf(msg.sender, _burnId) > 0, "Only the owner can burn this panda.");
        _burn(msg.sender, _burnId, 1);
        pandas[_advanceId].class++;
    }

    // SET THIS TO INTERNAL ON DEPLOYMENT
    function getRandomNumber(uint256 number) public view returns(uint256 a, uint256 b, uint256 c, uint256 d){ // In testing call this 1000's of times and view distribution
        a = uint(keccak256(abi.encodePacked(msg.sender, block.timestamp))) % (number + 1);
        b = uint(keccak256(abi.encodePacked(block.timestamp, block.number))) % (number + 1);
        c = uint(keccak256(abi.encodePacked(block.number, msg.sender))) % (number + 1);
        d = uint(keccak256(abi.encodePacked(a, b, c))) % (rarityLimit + 1); 
    }

    // CHANGE TO INTERNAL ON DEPLOYMENT
    function getRarity(uint256 _number) public view returns (uint256) {
        uint256 _result;
        if(_number <= rarities.natural) {_result = 0; }
        if(_number <= rarities.prime) {_result = 1; }
        if(_number <= rarities.champion) {_result = 2; }
        if(_number <= rarities.imp) {_result = 3; }
        if(_number <= rarities.divine) {_result = 4; }
        return _result;
    }
    
    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

}
