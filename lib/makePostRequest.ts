
import toast from 'react-hot-toast';

export default async function makePostRequest({
  setLoading,
  endPoint,
  data,
  resourceName,
  reset,
  redirect,
  router // Pass the router object as an argument
}: {
  setLoading: any,
  endPoint: string,
  redirect:string,
  data: any,
  resourceName: any,
  reset: any,
  router: any // Add router type
}) 
{
  try {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}${endPoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      toast.success(`New ${resourceName} created successfully`);
      router.push(`${redirect}`); // Redirect upon success
      reset();
      setLoading(false);
      
    } else {
      setLoading(false);
      throw new Error(`Failed to create ${resourceName}`);
    }
  } catch (error) {
    setLoading(false);
    console.error("Error making POST request:", error);
    toast.error(`Failed to create ${resourceName}: ${error}`);
  }
}
