import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleDecryption } from '@/functions/handleCryptogaphy';
import { UserSuggestionTypes, FieldValues } from '@/types/DataTypes';

const getUserSuggestions = async (type:UserSuggestionTypes, teamLead?:string) => {
	try {
		const query:FieldValues = {type:type};
		if (teamLead)
			query["RM"]=teamLead;
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/suggestion`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: query
		});
		const decryptedObject = await handleDecryption(response.data) as FieldValues[];
		
		if (response.status==200)
			return {status:200, obj:decryptedObject}
		else
			return {status:response.status, obj:[]}
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:[]}
		else
			return {status:error.response.status as number, obj:[]}
	}
};

export {getUserSuggestions};