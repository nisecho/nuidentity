import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const { userid } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log(userid)
                const userDocRef = doc(firestore, 'users', userid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserData(userData);
                } else {
                    setUserData('userNotFound');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userid]);

    return (
        <div>
            <Navbar />
            {userData === 'userNotFound' ? (
                <p>User not found</p>
            ) : userData ? (
                <ProfileInfo userData={userData} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserPage;
