import axios from 'axios';

async function getUf () {
  return await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
};

async function getCities (val) {
  return await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${val}/municipios`);
}

export default { getUf, getCities };
