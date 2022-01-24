// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Patient {
    
    struct structPatient{
        uint id;
        string fullName;
        string dateOfBirth;
        string CNIC;
        string creatorAddress;
        string PhoneNo;
        string email;
        string status;
        string gender;
        address accountAddress;
        uint dateCreated;
    }
    struct commonMedicalConditions{
        bool AlcoholOrDrugDependence;
        bool Seizure;
        bool HeartDisease;
        bool Blackout;
        bool Stroke;
        bool VisualFieldOrAcuityImpairment;
        bool Diabetes;
        bool MentalOrEmotionalIllness;
        bool DementiaOrAlzheimer;
        bool SleepApneaOrNarcolepsy;
        string other;
    }
    struct structPatientReport{
        uint reportId;
        address patientAddress;
        string Title;
        string Description;
        string Report;
    }
    uint public patientCount = 0;
    uint public reportCount = 0;
    uint public currentId = 0;

    mapping(uint => structPatient) public Patients;
    mapping(uint => commonMedicalConditions) public MedicalConditions;
    mapping(uint => structPatientReport) public PatientReports;

    constructor () {
    }
     function AddPatient(string memory _fullName, string memory _dateOfBirth, string memory _cnic, 
                        string memory _hospitalId, string memory _phoneNo, string memory _email, string memory _status, string memory _gender, address _accountAddress) public returns (bool)
    {
            structPatient memory patient;
            patient.id = patientCount;
            patient.fullName = _fullName;
            patient.dateOfBirth = _dateOfBirth;
            patient.CNIC = _cnic;
            patient.creatorAddress = _hospitalId;
            patient.PhoneNo = _phoneNo;
            patient.email = _email;
            patient.status = _status;
            patient.gender = _gender;
            patient.accountAddress = _accountAddress;
            patient.dateCreated = block.timestamp;
            Patients[patientCount] = patient;  
            return true;
      
    }

    function AddMedicalCondition(bool _dependence, bool _seizure, bool _heartDisease, bool _blackout, bool _stroke, bool _VFAI, bool _diabetes, bool _mentalIllness, bool _dementia, bool _sleepApneaOrNarcolepsy, string memory _other) public returns (bool)
    {
        MedicalConditions[patientCount] = commonMedicalConditions(_dependence, _seizure, _heartDisease, _blackout, _stroke, _VFAI, _diabetes, _mentalIllness, _dementia, _sleepApneaOrNarcolepsy, _other);
        patientCount++;
        return true;
    }

    function getAll() public view returns (structPatient[] memory)
    {
        structPatient[] memory hospitalList = new structPatient[](patientCount+1);
        for (uint i = 0; i <patientCount; i++) 
        {
            hospitalList[i] = Patients[i];
        }
        return hospitalList;
    }
    function addReport(address _patientAddress, string memory _tittle, string memory _description, string memory _report) public returns (bool) {
            
            PatientReports[reportCount] = structPatientReport(reportCount,_patientAddress, _tittle,  _description,  _report); 
            reportCount ++;
            return true;
    }
    function getReport(address _patientAddress) public view returns(structPatientReport[] memory)
    {
        structPatientReport[] memory patientReport = new structPatientReport[](getReportCount(_patientAddress));
        for (uint i = 0; i <patientCount; i++) 
        {
             if(keccak256(abi.encodePacked(PatientReports[i].patientAddress)) == keccak256(abi.encodePacked(_patientAddress)))
             {
                patientReport[i] = PatientReports[i];
             }
        }
        return patientReport;
    }
    function getReportCount(address _patientAddress) public view returns(uint) {
       
        uint count = 0;
        for (uint i = 0; i <patientCount; i++) 
        {
             if(keccak256(abi.encodePacked(PatientReports[i].patientAddress)) == keccak256(abi.encodePacked(_patientAddress))) count++;
        }
        return count;
    }

    function getPatient(address _address) public view returns (string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory, uint id, string memory, uint)
    {
        for (uint i = 0; i < patientCount; i++) 
        {
            if(Patients[i].accountAddress == _address)
            {
                structPatient memory patient = Patients[i];
                return (patient.fullName, patient.dateOfBirth, patient.CNIC, patient.PhoneNo, patient.email, patient.status, patient.gender, patient.id, patient.creatorAddress, patient.dateCreated);
            }
        }
        revert("Not found");
    }

    function getPatientConditions(uint id) public view returns (bool, bool, bool, bool, bool, bool, bool, bool, bool, bool, string memory) {
        commonMedicalConditions memory conditions = MedicalConditions[id];
        return (conditions.AlcoholOrDrugDependence, conditions.Seizure, conditions.HeartDisease, conditions.Blackout, conditions.Stroke, conditions.VisualFieldOrAcuityImpairment, conditions.Diabetes, conditions.MentalOrEmotionalIllness, conditions.DementiaOrAlzheimer, conditions.SleepApneaOrNarcolepsy, conditions.other);
    }

    function updatePatient(string memory _id, string memory _name, string memory _dob, string memory _cnic, string memory _number, 
                            string memory _email, string memory _status, string memory _gender)  public  returns (bool)
    {
         for(uint i = 0; i < patientCount; i++){

            if(keccak256(abi.encodePacked(Patients[i].accountAddress)) == keccak256(abi.encodePacked(_id)) )
            {
                structPatient storage patient = Patients[i];
                patient.fullName = _name;
                patient.dateOfBirth = _dob;
                patient.CNIC = _cnic;
                patient.PhoneNo = _number;
                patient.email = _email;
                patient.status = _status;
                patient.gender = _gender;
                currentId = patient.id;
                return true; // record updated successfully
            }
        }
        return false; 
    }

    function updateConditions(bool _dependence, bool _seizure, bool _heartDisease, bool _blackout, bool _stroke, bool _VFAI, bool _diabetes, bool _mentalIllness, bool _dementia, bool _sleepApneaOrNarcolepsy, string memory _other) public returns (bool)
    {
         commonMedicalConditions storage conditions = MedicalConditions[currentId];
         conditions.AlcoholOrDrugDependence = _dependence;
         conditions.Seizure = _seizure;
         conditions.HeartDisease = _heartDisease;
         conditions.Blackout = _blackout;
         conditions.Stroke = _stroke;
         conditions.VisualFieldOrAcuityImpairment = _VFAI;
         conditions.Diabetes = _diabetes;
         conditions.MentalOrEmotionalIllness = _mentalIllness;
         conditions.DementiaOrAlzheimer = _dementia;
         conditions.SleepApneaOrNarcolepsy = _sleepApneaOrNarcolepsy;
         conditions.other = _other;
         currentId = 0;
         return true;
    }
}
