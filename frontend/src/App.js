import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import TodoABI from './contracts/Todo.json';
import './App.css';

const CONTRACT_ADDRESS =  "0x29076487177D298B4ac7DFEfaF3b9cd538280B51" ;
console.log("Contract Address from .env:", CONTRACT_ADDRESS);
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // কন্ট্রাক্ট ইন্টারঅ্যাকশন হ্যান্ডলার
  const callContractMethod = async (method, args = []) => {
    if (!contract) {
      setError("Contract not connected");
      return null;
    }

    try {
      setLoading(true);
      setError('');
      const tx = await contract[method](...args);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      console.error(`Error in ${method}:`, err);
      setError(err.message || "Transaction failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ওয়ালেট কানেক্ট
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
      
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const todoContract = new Contract(CONTRACT_ADDRESS, TodoABI.abi, signer);
      setContract(todoContract);
      
      await loadTasks(todoContract);
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  // টাস্ক লোড
  const loadTasks = async (contract) => {
    try {
      setLoading(true);
      const taskList = await contract.showTask();
      setTasks(taskList);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // টাস্ক অ্যাড
  const handleAddTask = async () => {
    if (!newTask.trim()) {
      setError("Task cannot be empty");
      return;
    }

    const receipt = await callContractMethod("addTask", [newTask]);
    if (receipt) {
      setNewTask('');
      await loadTasks(contract);
    }
  };

  // টাস্ক কমপ্লিট
  const handleComplete = async (index) => {
    await callContractMethod("complited", [index]);
    await loadTasks(contract);
  };

  // টাস্ক রিমুভ
  const handleRemove = async (index) => {
    await callContractMethod("rmvTask", [index]);
    await loadTasks(contract);
  };

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}
      <header>
        <h1>Blockchain Todo App</h1>
        {!account ? (
          <button 
            onClick={connectWallet} 
            className="connect-btn"
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="wallet-info">
            Connected: {`${account.substring(0, 6)}...${account.substring(38)}`}
          </div>
        )}
      </header>

      <main>
        {account && (
          <>
            <div className="task-input">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
                disabled={loading}
              />
              <button 
                onClick={handleAddTask} 
                disabled={loading || !newTask.trim()}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>

            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="empty-message">No tasks found. Add your first task!</p>
              ) : (
                <ul>
                  {tasks.map((task, index) => (
                    <li key={index} className={task.status === "Complited" ? 'completed' : ''}>
                      <span className="task-name">{task.name}</span>
                      <span className="task-status">{task.status}</span>
                      <div className="task-actions">
                        {task.status !== "Complited" && (
                          <button 
                            onClick={() => handleComplete(index)}
                            disabled={loading}
                          >
                            Complete
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemove(index)}
                          disabled={loading}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>

      <footer>
        <p>Built with React & Ethereum</p>
      </footer>
    </div>
  );
}

export default App;