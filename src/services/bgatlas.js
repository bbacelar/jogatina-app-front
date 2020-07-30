import { axiosInstance } from 'src/boot/axios';
export async function searchBoardgame (bgname) {
  return await axiosInstance({
    method: 'GET',
    url: `/atlas/${bgname}`
  });
}

export default { searchBoardgame };
