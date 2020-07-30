import { axiosInstance } from 'src/boot/axios';
export async function addPlay (data) {
  return await axiosInstance({
    method: 'POST',
    url: '/plays',
    data
  });
}

export async function deletePlay (playId) {
  return await axiosInstance({
    method: 'DELETE',
    url: `/plays/${playId}`
  });
}

export async function getPlays () {
  return await axiosInstance({
    method: 'GET',
    url: '/plays'
  });
}

export async function getPlayById (id) {
  return await axiosInstance({
    method: 'GET',
    url: `/plays/${id}`
  });
}

export async function getPlaysByGroupId (groupId) {
  return await axiosInstance({
    method: 'GET',
    url: `/plays/group/${groupId}`
  });
}

export async function addUser (userId, playId) {
  return await axiosInstance({
    method: 'POST',
    url: `/plays/${playId}/user/${userId}`
  });
}

export async function deleteUser (userId, playId) {
  return await axiosInstance({
    method: 'DELETE',
    url: `/plays/${playId}/user/${userId}`
  });
}

export async function updatePlay (play) {
  return await axiosInstance({
    method: 'PUT',
    url: '/plays',
    data: play
  });
}

export default {
  addPlay,
  getPlays,
  getPlaysByGroupId,
  getPlayById,
  addUser,
  deleteUser,
  updatePlay,
  deletePlay
};
