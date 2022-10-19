import axios, { AxiosError } from 'axios';

export const fetchTrailheads = async (id: string) => {
	const { data } = await axios.post(
		'/api/fetchEntryPoints',
		{
			id,
		},
		{
			withCredentials: true,
		}
	);
    // console.log('data: ', data)
	return data;
};
