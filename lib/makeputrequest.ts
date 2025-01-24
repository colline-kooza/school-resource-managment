import toast from 'react-hot-toast';

export default async function makePutRequest({
  setLoading,
  endPoint,
  data,
  resourceName,
  reset,
  redirect,
  router,
}: {
  setLoading: any;
  endPoint: string;
  redirect: string;
  data: any;
  resourceName: any;
  reset: any;
  router: any;
}) {
  try {
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/${endPoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success(`${resourceName} updated successfully!`);
      router.push(redirect); // Redirect upon success
    } else {
      // Handle errors in a single try-catch block
      const clonedResponse = response.clone();
      let errorMessage = `Failed to update ${resourceName}`;

      try {
        // Try to parse as JSON
        const errorData = await clonedResponse.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If not JSON, fallback to plain text
        try {
          const textData = await clonedResponse.text();
          errorMessage = textData || errorMessage;
        } catch {
          console.warn("Failed to parse response as JSON or plain text.");
        }
      }

      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Error making PUT request:", error);
    toast.error(
      `Failed to update ${resourceName}: ${error.message || "An unknown error occurred"}`
    );
  } finally {
    setLoading(false);
  }
}
