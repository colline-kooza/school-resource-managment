export async function getData(endpoint:any) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/${endpoint}`, {
        // cache: "no-store",
        next: { revalidate: 60 }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }