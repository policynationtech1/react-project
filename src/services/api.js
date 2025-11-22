import axios from 'axios';

export const submitData = async (data) => {
  const res = await axios.post('http://localhost:5000/calculate', data);
  return res.data;
};
