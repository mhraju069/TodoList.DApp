// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Todo {
    struct Task {
        uint id;
        string name;
        string status;
    }
    Task[] public list;
    address owner = msg.sender;

    modifier Owner(){
        require(msg.sender == owner, "Not owner");
        _;
    }

    function addTask(string memory task) public Owner{
        list.push(Task(list.length,task,"Pending"));
    }
    function rmvTask(uint index) public Owner{
        for (uint i = index;i<list.length-1;i++){
            list[i]=list[i+1];
            
        }
        list.pop();
    }
    function showTask() view public returns(Task[] memory){
        return list;
    }
    function complited(uint index) public Owner{
        list[index].status = "Complited";
    }
}