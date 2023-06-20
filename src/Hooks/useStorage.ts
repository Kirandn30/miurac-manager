import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

async function uploadAndGetURL(path: string, file: File): Promise<string> {
    const storageRef = ref(storage, path);
    // Use uploadBytesResumable to upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Handle the progress of the upload here if needed
            },
            (error) => {
                // Handle unsuccessful uploads
                reject(error);
            },
            async () => {
                // Upload completed successfully, get the download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
}

export default uploadAndGetURL;
