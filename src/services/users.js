import { axiosInstance } from 'src/boot/axios';
async function getUsersByPlayId (playId) {
  return await axiosInstance({
    method: 'GET',
    url: `/users/play/${playId}`
  });
}

async function getUsersByGroupId (groupId) {
  return await axiosInstance({
    method: 'GET',
    url: `/users/group/${groupId}`
  });
}

export default { getUsersByPlayId, getUsersByGroupId };
