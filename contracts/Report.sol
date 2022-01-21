// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Report {
    
    struct structReport{
        uint id;
        string tittle;
        string description;
        string details;
        address patientAddress;
    }
    uint reportCount = 0;

    mapping(uint => structReport) public Reports;

    constructor ()
    {
        createReport("Test Report","Description","Details Here", 0x910Ce3C1e5d7E479F1669384D8110436fE077113);
    }
    function getCount() public view returns(uint)
    {
        return reportCount;
    }
    function createReport(string memory _tittle, string memory _description, string memory _details, address _patientAddress) public  returns (bool)
    {
        Reports[reportCount] = structReport(reportCount, _tittle, _description, _details, _patientAddress);
        reportCount ++;
        return true;
    }
    function getAll(address _patientAddress) public view returns (structReport[] memory)
    {
        uint count = 0;
        structReport[] memory reports = new structReport[](getPatientReportCount(_patientAddress));
        for (uint i = 0; i < reportCount; i++) 
        {
             if(keccak256(abi.encodePacked(Reports[i].patientAddress)) == keccak256(abi.encodePacked(_patientAddress)))
             {
                 reports[count++] = Reports[i];
             }
        }
        return reports;
    }
    function getPatientReportCount(address _patientAddress) private view returns (uint)
    {
        uint count = 0;
        for (uint i = 0; i < reportCount; i++) 
        {
             if(keccak256(abi.encodePacked(Reports[i].patientAddress)) == keccak256(abi.encodePacked(_patientAddress)))
             {
                 count++;
             }
        }
        return count;
    }
    
}
