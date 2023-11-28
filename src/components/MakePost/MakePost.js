import React, { useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import {getDownloadURL, uploadBytesResumable, ref} from "firebase/storage";
import {firestore, storage} from "../../firebase";
import {addDoc, collection, doc, serverTimestamp, getDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import Autocomplete from '@mui/material/Autocomplete';

const options = [
    "Ichika", "Saki", "Honami", "Shiho",
    "Akito", "Toya", "An", "Kohane",
    "Kanade", "Mafuyu", "Ena", "Mizuki"

]


const MakePost = ({ isOpen, handleClose }) => {
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [tags, setTags] = useState([]);

    const handleImageChange = (event) => {
        // Handle image upload logic here
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);
    };

    const handleTagChange = (event, newTags) => {
        setTags(newTags);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Generate a unique identifier
            const uniqueId = uuidv4();

            // Upload image to Firebase Storage
            console.log("fuck");
            const storageRef = ref(storage, `images/${uniqueId}/${selectedImage.name}`);
            console.log("shit");
            const uploadTask = uploadBytesResumable(storageRef, selectedImage);
            console.log("shit2");
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Progress monitoring if needed
                    },
                    (error) => {
                        // Handle any errors during upload
                        console.error("Upload error:", error);
                        reject(error);
                    },
                    () => {
                        // On successful upload completion
                        console.log("Upload completed!");
                        resolve();
                    }
                );
            });

            // Get the download URL after successful upload
            const imageUrl = await getDownloadURL(storageRef);
            console.log("Download URL:", imageUrl);

            const auth = getAuth();
            const currentUser = auth.currentUser;
            console.log(currentUser)


            // Fetch user-specific data from Firestore
            const userDocRef = doc(firestore, 'users', currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();


            // Create a new post document in Firestore
            const postsCollection = collection(firestore, 'posts');
            await addDoc(postsCollection, {
                image_url: imageUrl,
                user: {
                    uuid: currentUser.uid,
                    displayName: userData.displayName,
                    pfp: userData.profilePicture,
                },
                caption: description,
                date_posted: serverTimestamp(),
                likes: [],
                tags: tags, // Add the tags array to the Firestore document
            });

            setDescription('');
            setSelectedImage(null);
            handleClose();
        } catch (error) {
            console.error('Error uploading post:', error);
        }
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
                <h2>Make a Post</h2>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Write your description here"
                    style={{ width: '100%', marginTop: '10px' }}
                />
                <Autocomplete
                    multiple
                    id="tags"
                    options={options} // Add your list of available tags here
                    value={tags}
                    onChange={handleTagChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Tags"
                            placeholder="Add tags"
                        />
                    )}
                />
                <Button variant="contained" onClick={handleSubmit} style={{ marginTop: '10px' }}>
                    Post
                </Button>
            </div>
        </Modal>
    );
};

export default MakePost;