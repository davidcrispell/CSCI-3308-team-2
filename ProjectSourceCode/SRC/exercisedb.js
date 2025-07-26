const axios = require('axios');

const api = axios.create({
  baseURL: 'https://www.exercisedb.dev/api/v1'
});

async function searchExercises(query) {
  const params = { q: query || '' };
  const { data } = await api.get('/exercises/search', { params });
  return data.data || [];
}

async function getExerciseById(id) {
  const { data } = await api.get(`/exercises/${id}`);
  return data.data;
}

module.exports = {
  searchExercises,
  getExerciseById
};
