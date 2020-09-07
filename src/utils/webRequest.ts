import axios from 'axios';

export default async(url: string) => {
  if(!url) return new Error(`Invalid url`);
  try {
    const response = await axios.get(url);
    if(response.status === 200) {
      return response.data;
    } else return new Error(`[Request error]: ${response.status} - ${response.statusText}`);
  } catch (err) {
    return new Error(`[Request error]: ${err.message}`);
  }
}