import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import EditProfile from '../../components/EditProfile/EditProfile';

const Profile = () => {
    const { userid } = useParams();

    // Use the userid parameter in your component logic
    // For example, fetch user data based on this ID

    return (
        <div>
            <Navbar></Navbar>
            <EditProfile></EditProfile>
        </div>
    );
};

export default Profile;
