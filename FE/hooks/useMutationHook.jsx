'use client';
import { useMutation, useQuery } from '@tanstack/react-query';

const BASE_URL = 'http://localhost:5500'; // Replace with your API base URL

async function postData(url, data, token, isFormData) {
    // const headers = {
    //     'Content-Type': isFormData ? `multipart/form-data; boundary=${data._boundary}` : 'application/json',
    // };

    let headers = {};

    if (!isFormData) {
        headers = {
            'Content-Type': 'application/json',
        };
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
        headers: headers,
    });

    const responseData = await response.json();
    return {
        responseData: responseData,
        status: response.status,
    };
}

async function patchData(url, data) {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            // You might need to include authentication headers here
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return {
        responseData: responseData,
        status: response.status,
    };
}

async function fetchData(url, token) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: headers,
    });

    const responseData = await response.json();
    return {
        responseData: responseData,
        status: response.status,
    };
}

function useCustomMutation() {
    return useMutation(async ({ url, data, keyword, method, token, isFormData }) => {
        if (method === 'POST') {
            return postData(url, data, token, isFormData);
        } else if (method === 'PATCH') {
            return patchData(url, data, token, isFormData);
        } else {
            throw new Error(`Invalid method: ${method}`);
        }
    });
}

export function useCustomQuery(url, keyword, token) {
    return useQuery([keyword, url], async () => {
        return fetchData(url, token);
    });
}

export default useCustomMutation;
