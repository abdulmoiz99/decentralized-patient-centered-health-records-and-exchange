pragma solidity >=0.4.22 <0.9.0;

contract Right {
    
    struct structRight{
        uint id;
        uint roleId;
        string formName;
        bool add;
        bool edit;
        bool remove;
        bool display;
        bool print;
    }

    mapping(uint => structRight ) public Rights;
   
    constructor () {
    }
}
