// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Report {
    
    struct structReport{
        uint id;
        string title;
        string description;
        string details;
        address patientAddress;
        uint dateCreated;
    }
    uint reportCount = 0;

    mapping(uint => structReport) public Reports;

    constructor ()
    {
    }

    function getCount() public view returns(uint)
    {
        return reportCount;
    }

    function createReport(string memory _title, string memory _description, string memory _details, address _patientAddress) public  returns (bool)
    {
        Reports[reportCount] = structReport(reportCount, _title, _description, _details, _patientAddress, block.timestamp);
        reportCount ++;
        return true;
    }

    function getFirstReportDate() public view returns (uint) {
        return Reports[0].dateCreated;
    }

    function getAllReports() public view returns (uint[] memory) {
        uint[] memory reportsTime = new uint[](reportCount);

        for (uint i = 0; i < reportCount; i++) {
             reportsTime[i] = Reports[i].dateCreated;
        }
        return reportsTime;
    }

    function isPatientReport(uint _id, address _patientAddress) public view returns (bool)
    {
        if (Reports[_id].patientAddress == _patientAddress) return true;
        else return false;
    }

    function getPatientReport(uint _id) public view returns (string memory, string memory, string memory, address, uint) {
        return (Reports[_id].title, Reports[_id].description, Reports[_id].details, Reports[_id].patientAddress, Reports[_id].dateCreated);
    } 
}
