pragma solidity >=0.4.22 <0.9.0;

contract Patient {
    
    struct structPatient{
        uint id;
        string fullName;
        string dateOfBirth;
        string CNIC;
        uint hospitalId;
        string PhoneNo;
        string email;
        string status;
        string gender;
        uint CommonMedialConditionId;
    }
    mapping(uint => structPatient) public Patients;

    constructor () {

    }
}
