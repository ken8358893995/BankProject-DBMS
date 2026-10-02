import axios from 'axios';
import { HOST } from './config';

export async function getBranches() {
  try {
    const response = await axios.get(`${HOST}/branches`);
    return response.data;
  } catch (err) {
    return await Promise.reject('Failed to get branches list!');
  }
}

export async function addBranch(newBranch) {
  try {
    const response = await axios.post(`${HOST}/branches/add`, newBranch);
    return response.data;
  } catch (err) {
    return await Promise.reject('Failed to add branch!');
  }
}
