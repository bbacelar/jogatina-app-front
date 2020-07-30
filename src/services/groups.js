import { axiosInstance } from 'src/boot/axios';
export async function getGroups () {
  return await axiosInstance({
    method: 'GET',
    url: '/groups'
  });
}

export async function getGroupById (id) {
  return await axiosInstance({
    method: 'GET',
    url: `/groups/${id}`
  });
}

export async function addGroup (data) {
  return await axiosInstance({
    method: 'POST',
    url: '/groups',
    data
  });
}

export async function updateGroup (data) {
  return await axiosInstance({
    method: 'PUT',
    url: '/groups',
    data
  });
}

export async function getGroupsByUser () {
  return await axiosInstance({
    method: 'GET',
    url: '/groups/user'
  });
}

export async function addCurrentUserInGroup (groupId) {
  return await axiosInstance({
    method: 'POST',
    url: `/groups/${groupId}/user`
  });
}

export async function deleteUserFromGroup (userId, groupId) {
  return await axiosInstance({
    method: 'DELETE',
    url: `/groups/${groupId}/user/${userId}`
  });
}

export async function deleteGroup (groupId) {
  return await axiosInstance({
    method: 'DELETE',
    url: `/groups/${groupId}`
  });
}

export default {
  getGroups,
  addGroup,
  updateGroup,
  getGroupsByUser,
  addCurrentUserInGroup,
  deleteUserFromGroup,
  getGroupById,
  deleteGroup
};
