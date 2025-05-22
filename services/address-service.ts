import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_CSC_API_KEY!;
const BASE_URL = 'https://api.countrystatecity.in/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CSCAPI-KEY': API_KEY,
  },
});

type Option = {
  label: string;
  value: string;
};

export const fetchCountries = async (): Promise<Option[]> => {
  const { data } = await axiosInstance.get('/countries');
  return data.map((country: any) => ({
    label: country.name,
    value: country.iso2,
  }));
};

export const fetchStates = async (countryCode: string): Promise<Option[]> => {
  const { data } = await axiosInstance.get(`/countries/${countryCode}/states`);
  return data.map((state: any) => ({
    label: state.name,
    value: state.iso2,
  }));
};

export const fetchCities = async (
  countryCode: string,
  stateCode: string
): Promise<Option[]> => {
  const { data } = await axiosInstance.get(
    `/countries/${countryCode}/states/${stateCode}/cities`
  );
  return data.map((city: any) => ({
    label: city.name,
    value: city.name,
  }));
};
