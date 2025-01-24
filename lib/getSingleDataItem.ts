// import React from 'react'

// export async function getSingleDataItem(id:string,endPoint:string) {
//     const baseUrl=process.env.NEXT_PUBLIC_BASE_URL
//     const response=await fetch(`${baseUrl}/api/${endPoint}/${id}`);
//     const resource=await response.json(); 
//     return resource;
// }

export async function getSingleDataItem(id: string, endPoint: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/${endPoint}/${id}`);

    // Check if the response is successful
    if (!response.ok) {
        // Try to extract the error message
        const errorText = await response.text(); // Read the response as plain text
        console.error(`Error fetching ${endPoint}/${id}:`, errorText);

        throw new Error(`Failed to fetch ${endPoint}/${id}: ${response.status} ${response.statusText}`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Unexpected response format:', errorText);

        throw new Error('Expected JSON response but received unexpected content');
    }

    // Parse and return the JSON data
    try {
        const resource = await response.json();
        return resource;
    } catch (error) {
        console.error('Failed to parse JSON response:', error);
        throw new Error('Invalid JSON response');
    }
}
