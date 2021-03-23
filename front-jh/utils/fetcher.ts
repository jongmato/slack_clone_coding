import axios from 'axios';

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response);

export default fetcher;
