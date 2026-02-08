import './Header.scss'
import NavBar from '../NavBar/NavBar';

function Header() {
    return (
        <>
        <header className='header'>
            <div className='header-image'></div>
            <NavBar/>
        </header>
        </>
    )
}

export default Header;