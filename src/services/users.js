import { axiosInstance } from 'src/boot/axios';
export async function getUsersByPlayId (playId) {
  return await axiosInstance({
    method: 'GET',
    url: `/users/play/${playId}`
  });
}

export async function getUsersByGroupId (groupId) {
  return await axiosInstance({
    method: 'GET',
    url: `/users/group/${groupId}`
  });
}

export async function updateUser (user) {
  return await axiosInstance({
    method: 'PUT',
    url: '/users',
    data: user
  });
}

export async function getStats () {
  return await axiosInstance(
    {
      method: 'GET',
      url: '/users/stats'
    }
  );
}

export default { getUsersByPlayId, getUsersByGroupId, updateUser };
