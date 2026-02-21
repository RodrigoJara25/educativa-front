import './Header.scss'
import NavBar from '../NavBar/NavBar';
import UserCard from '../UserCard/UserCard';

function Header() {
    return (
        <>
            <header className='header'>
                <div className='header-image'>
                    <div className='user-card-container'>
                        <UserCard />
                    </div>
                </div>
                <NavBar />
            </header>
        </>
    )
}

export default Header;