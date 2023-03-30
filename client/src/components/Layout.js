import { Outlet, Link } from "react-router-dom";
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Button from '@mui/joy/Button';

function Layout(){

  if (!sessionStorage.getItem('token')) {
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            {/* <li>
              <Link to="/create">Create</Link>
            </li> */}
          </ul>
        </nav>

        <Outlet />
      </>
    )
  }
  if(sessionStorage.getItem('accesslevel') == 0){
    return (
      <div>
        <Breadcrumbs size = "md" separator="" align= "center">
        <Button size="md"  variant="plain" color="primary">
        <Link to="/logout">Log out</Link>

        </Button>
          
        <Button size="md"  variant="plain" color="primary">
          <Link to="/">Home</Link>
        </Button>

        <Button size="md"  variant="plain" color="primary">
        <Link to="/create">Create Post</Link>

        </Button>
        </Breadcrumbs>

        <Outlet />
      </div>
    )
  }
  if(sessionStorage.getItem('accesslevel') == 5){
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {/* <li>
              <Link to="/login">Login</Link>
            </li> */}
            <li>
              <Link to="/create">Create Post</Link>
            </li>
            <li>
              <Link to="/classes">Classes</Link>
            </li>
            <li>
              <Link to="/logout">Log out</Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </>
    )
  }
}

export default Layout;