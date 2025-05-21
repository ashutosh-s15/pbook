// hooks/useGeodb.ts
import axios from 'axios';

const API_HOST = 'wft-geo-db.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
// const API_KEY = '4660874403msh759a1af4550484fp147e48jsn6d9e0092f4c5';

const axiosInstance = axios.create({
  baseURL: `https://${API_HOST}/v1/geo`,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
});

type Option = {
  label: string;
  value: string;
};

export const fetchCountries = async (): Promise<Option[]> => {
  const { data } = await axiosInstance.get('/countries?limit=10');
  return data.data.map((country: any) => ({
    label: country.name,
    value: country.code,
  }));
};

export const fetchStates = async (countryCode: string): Promise<Option[]> => {
  const { data } = await axiosInstance.get(
    `/countries/${countryCode}/regions?limit=10`
  );
  return data.data.map((region: any) => ({
    label: region.name,
    value: region.isoCode,
  }));
};

export const fetchCities = async (
  countryCode: string,
  regionCode: string
): Promise<Option[]> => {
  const { data } = await axiosInstance.get(
    `/countries/${countryCode}/regions/${regionCode}/cities?limit=10`
  );
  return data.data.map((city: any) => ({
    label: city.name,
    value: city.name,
  }));
};
