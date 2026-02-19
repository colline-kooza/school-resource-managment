import toast from "react-hot-toast";

export async function incrementUpVotes(answerId:any) {
    try {
        const response = await fetch(`/api/answers/${answerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answerId }),
        });

        if (!response.ok) {
            throw new Error('Failed to increment upvotes');
        }
        toast.success("vote added")
        const updatedAnswer = await response.json();
    } catch (error) {
        console.log(error)
        // console.error('Error:', error.message);
    }
}
